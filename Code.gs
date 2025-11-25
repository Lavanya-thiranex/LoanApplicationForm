function doPost(e) {
  // 1. Get the active sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 2. Parse the incoming JSON data
  var data = JSON.parse(e.postData.contents);
  
  // 3. Get current timestamp
  var timestamp = new Date();
  
  // 4. Append the data as a new row
  // Note: We add "'" before numbers (mobile, pincode, aadhar) to ensure they are treated as text and not truncated/formatted
  sheet.appendRow([
    timestamp,          // Column A
    data.fullName,      // Column B
    data.dob,           // Column C
    data.gender,        // Column D
    "'" + data.mobile,  // Column E
    data.email,         // Column F
    data.address,       // Column G
    data.state,         // Column H
    data.district,      // Column I
    "'" + data.pincode, // Column J
    data.loanType,      // Column K
    data.loanAmount,    // Column L
    data.tenure,        // Column M
    data.income,        // Column N
    "'" + data.aadhar,  // Column O
    data.pan,           // Column P
    data.notes          // Column Q
  ]);
  
  // 5. Return a success response
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
