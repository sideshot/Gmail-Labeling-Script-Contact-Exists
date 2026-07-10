/**
 * Label recent unlabeled Gmail threads by whether the sender is in
 * Google Contacts (People API). Contacts in the "Ignore" group are
 * treated as not-in-contacts.
 *
 * Trigger: time-driven on addLabelIfContactExists.
 */
function addLabelIfContactExists() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) {
    Logger.log('Script is already running. Exiting to prevent overlap.');
    return;
  }
  try {
    processEmails();
  } finally {
    lock.releaseLock();
  }
}

function processEmails() {
  var threads = GmailApp.search('newer_than:10d has:nouserlabels');
  var contactLabel = getOrCreateLabel_('Contact Exists');
  var notInContactsLabel = getOrCreateLabel_('Not in Contacts');
  var index = buildContactIndex_();

  Logger.log(
    'Threads=' + threads.length +
    ' contacts=' + index.emailCount +
    ' ignored=' + index.ignoredCount
  );

  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    var messages = thread.getMessages();
    var known = false;

    for (var j = 0; j < messages.length; j++) {
      var email = extractEmail(messages[j].getFrom()).toLowerCase();
      if (!email) {
        continue;
      }
      if (index.ignored[email]) {
        continue;
      }
      if (index.emails[email]) {
        known = true;
        break;
      }
    }

    thread.addLabel(known ? contactLabel : notInContactsLabel);
  }
}

function getOrCreateLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

/**
 * One pass over Connections + ContactGroups so each run does not
 * re-scan the whole address book per message.
 */
function buildContactIndex_() {
  var emails = {};
  var ignored = {};
  var ignoreGroupResourceNames = {};

  var groupPageToken = null;
  do {
    var groupOpts = { pageSize: 100 };
    if (groupPageToken) {
      groupOpts.pageToken = groupPageToken;
    }
    var groupResp = People.ContactGroups.list(groupOpts);
    var groups = (groupResp && groupResp.contactGroups) || [];
    for (var g = 0; g < groups.length; g++) {
      var groupName = String(groups[g].name || '').toLowerCase();
      if (groupName === 'ignore') {
        ignoreGroupResourceNames[groups[g].resourceName] = true;
      }
    }
    groupPageToken = groupResp && groupResp.nextPageToken;
  } while (groupPageToken);

  var pageToken = null;
  do {
    var opts = {
      personFields: 'emailAddresses,memberships',
      pageSize: 1000
    };
    if (pageToken) {
      opts.pageToken = pageToken;
    }
    var page = People.People.Connections.list('people/me', opts);
    var connections = (page && page.connections) || [];

    for (var i = 0; i < connections.length; i++) {
      var person = connections[i];
      var isIgnored = false;
      var memberships = person.memberships || [];
      for (var m = 0; m < memberships.length; m++) {
        var membership = memberships[m].contactGroupMembership;
        var resourceName = membership && membership.contactGroupResourceName;
        if (resourceName && ignoreGroupResourceNames[resourceName]) {
          isIgnored = true;
          break;
        }
      }

      var addrs = person.emailAddresses || [];
      for (var a = 0; a < addrs.length; a++) {
        var value = String(addrs[a].value || '').toLowerCase().trim();
        if (!value) {
          continue;
        }
        if (isIgnored) {
          ignored[value] = true;
        } else {
          emails[value] = true;
        }
      }
    }

    pageToken = page && page.nextPageToken;
  } while (pageToken);

  return {
    emails: emails,
    ignored: ignored,
    emailCount: Object.keys(emails).length,
    ignoredCount: Object.keys(ignored).length
  };
}

function extractEmail(fromField) {
  var match = String(fromField || '').match(/<([^>]+)>/);
  return (match ? match[1] : String(fromField || '')).trim();
}
