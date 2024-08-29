# Gmail Labeling Script: "Contact Exists"

This Google Apps Script automatically labels Gmail threads with the "Contact Exists" label if the sender's email address exists in your Google Contacts. This can help you easily identify and organize emails from known contacts.

## Features

- Searches recent emails in your Gmail inbox.
- Checks if the sender's email address exists in your Google Contacts.
- Labels the email thread with "Contact Exists" if a match is found.

![image](https://github.com/user-attachments/assets/300818ee-d7cc-4858-a88d-19257ad4a6be)

## Installation

Follow the steps below to install and configure this script:

### 1. Create a New Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/).
2. Click on **New Project**.
3. Name your project (e.g., "Gmail Contact Labeler").

### 2. Copy the Script

Copy the following code into the Apps Script editor:

```javascript
function addLabelIfContactExists() {
  var threads = GmailApp.search('newer_than:1d'); // Modify the search query as needed
  var label = GmailApp.getUserLabelByName('Contact Exists');
  if (!label) {
    label = GmailApp.createLabel('Contact Exists');
  }
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var from = messages[j].getFrom();
      var email = extractEmail(from);
      if (isContactExists(email)) {
        threads[i].addLabel(label);
      }
    }
  }
}

function isContactExists(email) {
  var contacts = ContactsApp.getContactsByEmailAddress(email);
  return contacts.length > 0;
}

function extractEmail(fromField) {
  // Extract the email address from the "from" field
  var emailPattern = /<(.+)>/;
  var match = fromField.match(emailPattern);
  return match ? match[1] : fromField;
}
```

### 3. Authorize the Script

1. Click the **Run** button (►) in the Apps Script editor.
2. A dialog will appear asking for permission to access your Gmail and Contacts. Review and authorize the permissions.

### 4. Set Up a Trigger (Optional)

To have the script run automatically:

1. Click on the clock icon (Triggers) in the Apps Script editor.
2. Click **+ Add Trigger**.
3. Select `addLabelIfContactExists` for the function to run.
4. Set the time-based trigger to run every minute, hourly, daily, etc., based on your preference.

### 5. Customize the Script (Optional)

- **Search Query**: Modify the search query in the `GmailApp.search('newer_than:1d')` line to change the emails the script will process.
- **Label Name**: Change the label name from `"Contact Exists"` to something else if you prefer a different label.

### 6. Save and Test

- After setting everything up, save your project.
- Run the script manually or wait for the trigger to execute.
- Check your Gmail to see if the appropriate emails have been labeled with "Contact Exists".

## Disclaimer

This script is provided as-is, without any warranties or guarantees. Use it at your own risk. The author is not responsible for any issues or damages that may arise from using this script, including but not limited to unintended email labeling or any other unexpected behavior.

By using this script, you agree to take full responsibility for any actions it performs on your Gmail account. Always test the script in a controlled environment before deploying it widely.

## Troubleshooting

- If the script doesn't seem to be working, check the execution logs by going to **View > Logs** in the Apps Script editor.
- Ensure that the script has the necessary permissions to access your Gmail and Contacts.

## License

This script is provided under the MIT License. Feel free to use and modify it to suit your needs.
