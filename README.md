# Gmail Labeling Script: "Contact Exists"

Google Apps Script that labels recent unlabeled Gmail threads:

- **Contact Exists** — sender email is in your Google Contacts and not in the **Ignore** contact group
- **Not in Contacts** — sender is unknown, or is in **Ignore**

Uses the **People API** (not the deprecated `ContactsApp`).

## Files

| File | Role |
|------|------|
| `Code.gs` | Script source |
| `appsscript.json` | Manifest (People advanced service + OAuth scopes) |

## Behavior

1. Searches `newer_than:10d has:nouserlabels`
2. Builds a contact email index once per run (paginated Connections + ContactGroups)
3. Labels each matching thread once

## Install

1. Go to [script.google.com](https://script.google.com/) → **New project**
2. Copy `Code.gs` from this repo into the editor (replace the default `Code.gs`)
3. Project Settings → show `appsscript.json`, then replace it with the repo’s `appsscript.json`
4. Confirm **People API** is enabled under Services / Advanced Google services (the manifest already declares it)
5. Run `addLabelIfContactExists` once and approve **Gmail** + **Contacts** when prompted
6. Triggers → add a time-driven trigger on `addLabelIfContactExists` (e.g. every 5–15 minutes)

### Updating from an older copy

If you previously pasted the old README script that used `ContactsApp`, replace both `Code.gs` and `appsscript.json` with the current files on `main`, then run the function once to re-authorize.

## Ignore group

Create a Google Contacts group named **Ignore**. Contacts in that group are labeled **Not in Contacts**.

## Notes

- Labels are created automatically if missing.
- Only personal Google Contacts are checked (not the Workspace domain directory).
- Search window defaults to the last 10 days of unlabeled mail; change `newer_than:10d` in `processEmails()` if you want a different window.

## License

MIT
