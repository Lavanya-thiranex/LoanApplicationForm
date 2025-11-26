# Google Sheets Integration Setup Guide

To store the loan application data in Google Sheets, you need to set up a **Google Apps Script**. Follow these steps exactly:

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank sheet.
2. Name it **"Loan Applications"**.
3. In the first row (Row 1), add the following headers in this exact order:
   - **Column A**: Timestamp
   - **Column B**: Full Name
   - **Column C**: Date of Birth
   - **Column D**: Gender
   - **Column E**: Mobile
   - **Column F**: Email
   - **Column G**: Address
   - **Column H**: State
   - **Column I**: District
   - **Column J**: PIN Code
   - **Column K**: Loan Type
   - **Column L**: Loan Amount
   - **Column M**: Tenure
   - **Column N**: Income
   - **Column O**: Aadhar
   - **Column P**: PAN
   - **Column Q**: Notes

## Step 2: Add the Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the `Code.gs` file and paste the code below:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Get current timestamp
    var timestamp = new Date();
    
    // Append data to the sheet
    sheet.appendRow([
      timestamp,
      data.fullName,
      data.dob,
      data.gender,
      "'"+data.mobile, // Add ' to force string format for numbers
      data.email,
      data.address,
      data.state,
      data.district,
      "'"+data.pincode,
      data.loanType,
      data.loanAmount,
      data.tenure,
      data.income,
      "'"+data.aadhar,
      data.pan,
      data.notes
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Step 3: Deploy as Web App
1. Click the **Deploy** button (blue button top right) > **New deployment**.
2. Click the **Select type** (gear icon) > **Web app**.
3. Fill in the details:
   - **Description**: Loan App Backend
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (This is CRITICAL for the form to work without login)
4. Click **Deploy**.
5. You might be asked to **Authorize access**. Click "Review permissions", choose your account, click "Advanced", and then "Go to (Script Name) (unsafe)". This is safe since it's your own script.
6. Copy the **Web App URL** (it starts with `https://script.google.com/macros/s/...`).

## Step 4: Connect to Your Form
1. Open the `script.js` file in your project folder.
2. Find the line:
   ```javascript
   const SCRIPT_URL = "PASTE_WEB_APP_URL_HERE";
   ```
3. Replace `"PASTE_WEB_APP_URL_HERE"` with the URL you copied in Step 3.
   - Example: `const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";`
4. Save the file.

## Step 5: Test
1. Open `index.html` in your browser.
2. Fill out the form and click Submit.
3. Check your Google Sheet to see the new row appear!
