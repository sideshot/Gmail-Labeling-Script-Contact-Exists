# Gmail Labeling Script: "Contact Exists"

Google Apps Script that labels recent unlabeled Gmail threads:

- **Contact Exists** — sender email is in your Google Contacts and not in the **Ignore** contact group
- **Not in Contacts** — sender is unknown, or is in **Ignore**

Uses the **People API** (not the deprecated `ContactsApp`).

Live project (richard@cabinetparts.com): **Label Email if Contact Exists**

## Files

| File | Role |
|------|------|
| `Code.gs` | Script source |
| `appsscript.json` | Manifest (People advanced service + OAuth scopes) |

## Behavior

1. Searches `newer_than:10d has:nouserlabels`
2. Builds a contact email index once per run (paginated Connections + ContactGroups)
3. Labels each matching thread once

## Install / update

### Option A — push with `gws` (preferred)

```bash
gws script +push --script SCRIPT_ID --dir .
```

Requires Apps Script API enabled for the user:  
https://script.google.com/home/usersettings → **Google Apps Script API** On

### Option B — paste in the editor

1. Open [script.google.com](https://script.google.com/) → project **Label Email if Contact Exists**
2. Replace `Code.gs` and `appsscript.json` with the files in this repo
3. Run `addLabelIfContactExists` once and approve Gmail + Contacts
4. Confirm a time-driven trigger is attached to `addLabelIfContactExists`

## Ignore group

Create a Google Contacts group named **Ignore**. Contacts in that group are labeled **Not in Contacts**.

## Notes

- Labels are created automatically if missing.
- Domain directory lookup was removed; only personal Contacts are used (faster, fewer permission failures).
- Re-authorize after this update if the script prompts for Contacts/People scopes.

## License

MIT
