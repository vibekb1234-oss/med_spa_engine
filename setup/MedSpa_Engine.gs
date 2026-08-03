/**
 * ============================================================
 * MedSpa Growth Engine — Master Google Apps Script
 * ============================================================
 * ONE FILE. ONE INSTALL. DOES EVERYTHING.
 *
 * HOW TO INSTALL:
 * 1. Open your Google Sheet (or create a blank one, name it "MedSpa Growth Engine")
 * 2. Extensions → Apps Script
 * 3. Delete all existing code. Paste this entire file.
 * 4. Fill in the TWO constants below (webhook URL + review link)
 * 5. Save (Ctrl+S) → click Run → onOpen (approve permissions)
 * 6. Refresh your Sheet → you'll see the "MedSpa ⚡" menu
 *
 * FIRST RUN ORDER:
 * 1. MedSpa ⚡ → Setup → ✅ Create All Tabs & Headers
 * 2. MedSpa ⚡ → Setup → 🎭 Load Demo Data  (optional — for testing/demos)
 * 3. Use "Daily Operations" menu when running live
 * ============================================================
 */

// ============================================================
// YOUR SETTINGS — FILL THESE IN
// ============================================================
const N8N_WEBHOOK_COMPLETE = 'https://YOUR_N8N_DOMAIN/webhook/msg-appointment-complete';
const GOOGLE_REVIEW_LINK   = 'https://g.page/r/XXXX/review';
const CLINIC_NAME          = 'YOUR CLINIC NAME';
const CLINIC_EMAIL         = 'YOUR_CLINIC_EMAIL@gmail.com';
const BOOKING_SYSTEM_URL   = 'https://YOUR_BOOKING_LINK'; // optional — shown in confirmation email
const WEBHOOK_SECRET       = 'YOUR_WEBHOOK_SECRET';        // must match the secret in the Workflow Configurator
const CLINIC_TIMEZONE      = 'America/New_York';           // IANA tz — keep in sync with the configurator
// ============================================================

// ============================================================
// COLUMN HELPERS — find columns by header name, not by index.
// Sheets can be reordered without breaking the code.
// ============================================================
function _col(sheet, headerName) {
  if (!sheet) return -1;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idx = headers.indexOf(headerName);
  if (idx === -1) throw new Error('Column "' + headerName + '" not found on sheet "' + sheet.getName() + '"');
  return idx + 1; // 1-based for getRange
}
function _rowCols(sheet, headerNames) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headerNames.forEach(h => {
    const idx = headers.indexOf(h);
    if (idx === -1) throw new Error('Column "' + h + '" not found on sheet "' + sheet.getName() + '"');
    map[h] = idx + 1;
  });
  return map;
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('MedSpa ⚡')
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('🛠️ Setup')
        .addItem('✅ Create All Tabs & Headers',   'setupMedSpaSheet')
        .addItem('🎭 Load Demo Data (testing)',    'loadDemoData')
        .addItem('🗑️ Clear Demo Data',             'clearDemoData')
    )
    .addSeparator()
    .addSubMenu(
      SpreadsheetApp.getUi().createMenu('📋 Daily Operations')
        .addItem('📧 Send Booking Confirmation',    'sendBookingConfirmation')
        .addItem('✅ Mark Appointment as Complete', 'markAppointmentComplete')
        .addItem('➕ Add New Appointment Row',      'addAppointmentRow')
    )
    .addSeparator()
    .addItem('ℹ️ About', 'showAbout')
    .addToUi();
}

// ============================================================
// ============================================================
// SECTION 1 — SHEET SETUP
// ============================================================
// ============================================================

function setupMedSpaSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert(
    'Create All Tabs & Headers',
    'This will create (or rebuild) 3 tabs:\n• Clients\n• Appointments\n• Activity Log\n\nAll headers, column widths, dropdowns, and colour formatting will be set automatically.\n\nContinue?',
    ui.ButtonSet.YES_NO
  );
  if (result !== ui.Button.YES) return;
  try {
    _setupClientsSheet(ss);
    _setupAppointmentsSheet(ss);
    _setupActivityLogSheet(ss);
    _deleteDefaultSheet(ss);
    ui.alert('✅ Done!',
      'All 3 tabs are ready.\n\nNext:\n1. Copy the Sheet ID from the URL bar\n2. Paste it into your n8n workflows\n3. Paste it into the dashboard Settings tab',
      ui.ButtonSet.OK);
  } catch(e) {
    ui.alert('Error', e.message, ui.ButtonSet.OK);
    throw e;
  }
}

function _setupClientsSheet(ss) {
  let sheet = ss.getSheetByName('Clients');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('Clients');

  const headers = [
    'Client Email','Client Name','Phone Number','Service Interest',
    'Lead Source','Referral Name','Status','Total Visits',
    'Total Spend','Last Visit Date','Next Appointment','Last Follow-Up Date',
    'Follow-Up Count','Review Requested','Review Left','Referral Asked',
    'VIP Status','Notes','Created Date','Opted Out','Last Promo Month'
  ];
  sheet.getRange(1,1,1,headers.length).setValues([headers])
    .setFontWeight('bold').setBackground('#9d174d').setFontColor('#ffffff').setFontSize(11);
  sheet.setFrozenRows(1);

  [220,160,130,160,120,140,110,90,100,120,120,140,110,130,100,110,100,200,120,90,110]
    .forEach((w,i) => sheet.setColumnWidth(i+1, w));

  const yesNo = SpreadsheetApp.newDataValidation().requireValueInList(['Yes','No'],true).setAllowInvalid(false).build();
  [14,15,16,20].forEach(col => sheet.getRange(2,col,1000,1).setDataValidation(yesNo));

  sheet.getRange(2,7,1000,1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['New Inquiry','Booked','Completed','No-Show','Lapsed','VIP'],true)
      .setAllowInvalid(false).build()
  );
  sheet.getRange(2,17,1000,1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Standard','VIP','Lapsed'],true)
      .setAllowInvalid(false).build()
  );
  sheet.getRange(2,4,1000,1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Botox','Filler','Laser Hair Removal','HydraFacial','Microneedling','Body Contouring','IV Therapy','General Inquiry'],true)
      .setAllowInvalid(true).build()
  );

  const statusColors = [
    ['New Inquiry','#cfe2f3','#1e40af'],['Booked','#fff2cc','#92400e'],
    ['Completed','#d9ead3','#166534'],['No-Show','#f4cccc','#991b1b'],
    ['Lapsed','#efefef','#374151'],['VIP','#ffd966','#78350f']
  ];
  const rules = sheet.getConditionalFormatRules();
  statusColors.forEach(([val,bg,fg]) => {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(val).setBackground(bg).setFontColor(fg)
      .setRanges([sheet.getRange(2,7,1000,1)]).build());
  });
  sheet.setConditionalFormatRules(rules);
}

function _setupAppointmentsSheet(ss) {
  let sheet = ss.getSheetByName('Appointments');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('Appointments');

  const headers = [
    'Client Email','Client Name','Service','Provider',
    'Appointment Date','Appointment Time','Status',
    'Pre-Appt Reminder Sent','24hr Reminder Sent','Post-Appt Follow-Up Sent',
    'Review Request Sent','Revenue','Notes'
  ];
  sheet.getRange(1,1,1,headers.length).setValues([headers])
    .setFontWeight('bold').setBackground('#7c3aed').setFontColor('#ffffff').setFontSize(11);
  sheet.setFrozenRows(1);

  [220,160,160,140,130,120,110,160,140,180,150,100,200]
    .forEach((w,i) => sheet.setColumnWidth(i+1, w));

  sheet.getRange(2,7,1000,1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Scheduled','Completed','No-Show','Cancelled'],true)
      .setAllowInvalid(false).build()
  );
  const yesNo = SpreadsheetApp.newDataValidation().requireValueInList(['Yes','No'],true).setAllowInvalid(false).build();
  [8,9,10,11].forEach(col => sheet.getRange(2,col,1000,1).setDataValidation(yesNo));

  const apptColors = [
    ['Scheduled','#e0e7ff','#3730a3'],['Completed','#d9ead3','#166534'],
    ['No-Show','#f4cccc','#991b1b'],['Cancelled','#efefef','#374151']
  ];
  const rules = sheet.getConditionalFormatRules();
  apptColors.forEach(([val,bg,fg]) => {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(val).setBackground(bg).setFontColor(fg)
      .setRanges([sheet.getRange(2,7,1000,1)]).build());
  });
  sheet.setConditionalFormatRules(rules);
}

function _setupActivityLogSheet(ss) {
  let sheet = ss.getSheetByName('Activity Log');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('Activity Log');

  const headers = ['Timestamp','Client Email','Action Type','Details'];
  sheet.getRange(1,1,1,4).setValues([headers])
    .setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff').setFontSize(11);
  sheet.setFrozenRows(1);
  [180,220,180,400].forEach((w,i) => sheet.setColumnWidth(i+1, w));

  const actionColors = [
    ['New Inquiry','#dbeafe','#1e40af'],
    ['Review Request','#fef9c3','#854d0e'],
    ['No-Show Recovery','#fee2e2','#991b1b'],
    ['Pre-Appt Reminder','#e0e7ff','#3730a3'],
    ['VIP Re-Engagement','#fdf4ff','#7c3aed'],
    ['Post-Appt Check-In','#dcfce7','#166534'],
    ['Weekly Report','#f3f4f6','#374151']
  ];
  const rules = sheet.getConditionalFormatRules();
  actionColors.forEach(([val,bg,fg]) => {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(val).setBackground(bg).setFontColor(fg)
      .setRanges([sheet.getRange(2,3,5000,1)]).build());
  });
  sheet.setConditionalFormatRules(rules);
}

function _deleteDefaultSheet(ss) {
  const s = ss.getSheetByName('Sheet1');
  if (s && ss.getSheets().length > 1) try { ss.deleteSheet(s); } catch(e){}
}

// ============================================================
// ============================================================
// SECTION 2 — DAILY OPERATIONS
// ============================================================
// ============================================================

function sendBookingConfirmation() {
  const ui    = SpreadsheetApp.getUi();
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Appointments');
  if (!sheet) { ui.alert('Error', 'Could not find the "Appointments" sheet.', ui.ButtonSet.OK); return; }

  const activeRow = sheet.getActiveRange().getRow();
  if (activeRow <= 1) {
    ui.alert('Select a Row', 'Click the appointment row first, then use this menu.', ui.ButtonSet.OK);
    return;
  }

  const cols = _rowCols(sheet, ['Client Email','Client Name','Service','Provider','Appointment Date','Appointment Time','Status']);
  const getVal = (h) => sheet.getRange(activeRow, cols[h]).getValue();
  const clientEmail = getVal('Client Email'), clientName = getVal('Client Name'), service = getVal('Service'),
        provider = getVal('Provider'), apptDate = getVal('Appointment Date'), apptTime = getVal('Appointment Time'), status = getVal('Status');

  if (!clientEmail || !clientName) {
    ui.alert('Missing Data', 'This row needs at least a Client Email and Client Name.', ui.ButtonSet.OK);
    return;
  }
  if (status !== 'Scheduled') {
    const cont = ui.alert('Not Scheduled',
      'This appointment has status "' + status + '". Send confirmation anyway?', ui.ButtonSet.YES_NO);
    if (cont !== ui.Button.YES) return;
  }

  const confirm = ui.alert('Send Booking Confirmation?',
    'To: ' + clientEmail +
    '\nClient: ' + clientName +
    '\nService: ' + service +
    '\nDate: ' + apptDate + ' at ' + apptTime +
    '\nProvider: ' + provider +
    '\n\nThis sends a "Your appointment is confirmed" email directly from your Gmail.', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;

  const firstName = clientName.split(' ')[0];
  const subject   = '✅ Confirmed: Your ' + service + ' appointment';

  const body = '<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">' +
    '<div style="background:linear-gradient(135deg,#9d174d,#7c3aed);color:white;padding:28px 32px;border-radius:10px 10px 0 0;">' +
    '<h2 style="margin:0;font-size:20px;">✅ You\'re Booked!</h2>' +
    '<p style="margin:8px 0 0;opacity:0.9;font-size:14px;">We\'re looking forward to seeing you.</p>' +
    '</div>' +
    '<div style="background:#fdf4ff;border:1px solid #f0abfc;border-top:none;padding:28px 32px;">' +
    '<p style="font-size:15px;">Hi ' + firstName + ',</p>' +
    '<p style="font-size:15px;">Your appointment is confirmed. Here are your details:</p>' +
    '<div style="background:white;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #be185d;">' +
    '<table style="width:100%;border-collapse:collapse;">' +
    '<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;width:130px;">Service</td><td style="padding:8px 0;font-size:15px;font-weight:700;">' + service + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;">Date</td><td style="padding:8px 0;font-size:15px;font-weight:700;">' + apptDate + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;">Time</td><td style="padding:8px 0;font-size:15px;font-weight:700;">' + (apptTime || 'To be confirmed') + '</td></tr>' +
    '<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;">Provider</td><td style="padding:8px 0;font-size:15px;">' + (provider || CLINIC_NAME) + '</td></tr>' +
    '</table>' +
    '</div>' +
    '<p style="font-size:14px;"><strong>A few things to know before you arrive:</strong></p>' +
    '<ul style="font-size:14px;line-height:1.9;color:#374151;">' +
    '<li>Arrive 5–10 minutes early to complete any intake forms</li>' +
    '<li>Come with a clean face if you\'re receiving a facial treatment</li>' +
    '<li>Stay well hydrated — it helps with treatment results</li>' +
    '<li>If you need to reschedule, please give us at least 24 hours\' notice</li>' +
    '</ul>' +
    '<p style="font-size:14px;margin-top:20px;">Need to change anything? Just reply to this email — we\'ll sort it out quickly.</p>' +
    '<p style="font-size:14px;">We\'ll also send you a reminder closer to your appointment.<br><br>' +
    'Can\'t wait to see you!<br><strong>' + CLINIC_NAME + '</strong></p>' +
    '</div>' +
    '<p style="color:#9ca3af;font-size:11px;text-align:center;padding:12px;">Reply to this email to get in touch.</p>' +
    '</body></html>';

  try {
    GmailApp.sendEmail(clientEmail, subject, '', { htmlBody: body, name: CLINIC_NAME, replyTo: CLINIC_EMAIL });
    // Log it
    _logActivity(ss, clientEmail, 'Booking Confirmation', 'Booking confirmation sent for ' + service + ' on ' + apptDate + ' at ' + apptTime);
    ui.alert('✅ Sent!', 'Booking confirmation delivered to ' + clientEmail, ui.ButtonSet.OK);
  } catch(e) {
    ui.alert('⚠️ Email Error', 'Could not send email: ' + e.message +
      '\n\nMake sure Gmail permissions were granted when you first approved the script.', ui.ButtonSet.OK);
  }
}

function markAppointmentComplete() {
  const ui  = SpreadsheetApp.getUi();
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Appointments');
  if (!sheet) { ui.alert('Error','Could not find the "Appointments" sheet.',ui.ButtonSet.OK); return; }

  const activeRow = sheet.getActiveRange().getRow();
  if (activeRow <= 1) {
    ui.alert('Select a Row','Click an appointment row first, then use this menu.',ui.ButtonSet.OK);
    return;
  }

  const cols = _rowCols(sheet, ['Client Email','Client Name','Service','Provider','Appointment Date','Status','Post-Appt Follow-Up Sent','Review Request Sent']);
  const getVal = (h) => sheet.getRange(activeRow, cols[h]).getValue();
  const clientEmail = getVal('Client Email'), clientName = getVal('Client Name'), service = getVal('Service'),
        provider = getVal('Provider'), apptDate = getVal('Appointment Date'), currentStatus = getVal('Status');

  if (!clientEmail) { ui.alert('Empty Row','This row has no data.',ui.ButtonSet.OK); return; }

  if (currentStatus === 'Completed') {
    const refire = ui.alert('Already Completed',
      clientName + '\'s appointment is already Completed.\nRe-fire the review email?', ui.ButtonSet.YES_NO);
    if (refire !== ui.Button.YES) return;
  }

  const totalVisits = _getTotalVisits(ss, clientEmail);

  const confirm = ui.alert('Mark as Complete?',
    'Client: ' + clientName + '\nService: ' + service + '\nDate: ' + apptDate +
    '\n\nThis will:\n• Mark status → Completed\n• Schedule review request (24h)\n' +
    (totalVisits >= 2 ? '• Send referral ask (returning client — visit #' + totalVisits + ')' : '• First visit — no referral ask yet') +
    '\n\nContinue?', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;

  const now = new Date();
  sheet.getRange(activeRow, cols['Status']).setValue('Completed');
  sheet.getRange(activeRow, cols['Post-Appt Follow-Up Sent']).setValue('Yes');
  sheet.getRange(activeRow, cols['Review Request Sent']).setValue('Yes');

  _updateClientAfterCompletion(ss, clientEmail, totalVisits, now);

  const payload = {
    clientEmail, clientName, service, provider,
    googleReviewLink: GOOGLE_REVIEW_LINK,
    totalVisits
  };

  try {
    const res = UrlFetchApp.fetch(N8N_WEBHOOK_COMPLETE, {
      method: 'post', contentType: 'application/json',
      headers: { 'X-Webhook-Secret': WEBHOOK_SECRET },
      payload: JSON.stringify(payload), muteHttpExceptions: true
    });
    const code = res.getResponseCode();
    if (code === 200 || code === 201) {
      ui.alert('✅ Done!',
        clientName + ' marked complete.\nReview email scheduled for 24 hours.\n' +
        (totalVisits >= 2 ? '💜 Referral ask also scheduled.' : ''), ui.ButtonSet.OK);
    } else {
      ui.alert('⚠️ Webhook Warning',
        'Appointment marked complete in sheet, but webhook returned code ' + code +
        '.\nCheck that n8n Workflow 3 is active.', ui.ButtonSet.OK);
    }
  } catch(e) {
    ui.alert('⚠️ Webhook Error',
      'Marked complete in sheet, but could not reach webhook:\n' + e.message +
      '\n\nCheck N8N_WEBHOOK_COMPLETE at the top of the script.', ui.ButtonSet.OK);
  }
}

function addAppointmentRow() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Appointments');
  if (!sheet) return;
  const lastRow = sheet.getLastRow() + 1;
  const cols = _rowCols(sheet, ['Appointment Date','Status','Pre-Appt Reminder Sent','24hr Reminder Sent','Post-Appt Follow-Up Sent','Review Request Sent']);
  const today = Utilities.formatDate(new Date(), CLINIC_TIMEZONE, 'yyyy-MM-dd');
  sheet.getRange(lastRow, cols['Appointment Date']).setValue(today);
  sheet.getRange(lastRow, cols['Status']).setValue('Scheduled');
  sheet.getRange(lastRow, cols['Pre-Appt Reminder Sent']).setValue('No');
  sheet.getRange(lastRow, cols['24hr Reminder Sent']).setValue('No');
  sheet.getRange(lastRow, cols['Post-Appt Follow-Up Sent']).setValue('No');
  sheet.getRange(lastRow, cols['Review Request Sent']).setValue('No');
  sheet.setActiveRange(sheet.getRange(lastRow,1));
  SpreadsheetApp.getUi().alert('New row added. Fill in client details and adjust the date.');
}

function _getTotalVisits(ss, clientEmail) {
  const sheet = ss.getSheetByName('Clients');
  if (!sheet) return 1;
  const emailCol = _col(sheet, 'Client Email') - 1;        // 0-based for array access
  const visitsCol = _col(sheet, 'Total Visits') - 1;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if ((data[i][emailCol]||'').toString().trim().toLowerCase() === clientEmail.toLowerCase().trim()) {
      return (parseInt(data[i][visitsCol]) || 0) + 1;
    }
  }
  return 1;
}

function _updateClientAfterCompletion(ss, clientEmail, newTotalVisits, completedAt) {
  const sheet = ss.getSheetByName('Clients');
  if (!sheet) return;
  const cols = _rowCols(sheet, ['Client Email','Status','Total Visits','Last Visit Date','VIP Status']);
  const emailCol0 = cols['Client Email'] - 1;
  const data = sheet.getDataRange().getValues();
  const dateStr = Utilities.formatDate(completedAt, CLINIC_TIMEZONE, 'yyyy-MM-dd');
  for (let i = 1; i < data.length; i++) {
    if ((data[i][emailCol0]||'').toString().trim().toLowerCase() === clientEmail.toLowerCase().trim()) {
      const row = i + 1;
      const isVip = newTotalVisits >= 3;
      sheet.getRange(row, cols['Status']).setValue(isVip ? 'VIP' : 'Completed');
      sheet.getRange(row, cols['Total Visits']).setValue(newTotalVisits);
      sheet.getRange(row, cols['Last Visit Date']).setValue(dateStr);
      if (isVip) sheet.getRange(row, cols['VIP Status']).setValue('VIP');
      _logActivity(ss, clientEmail, 'Post-Appt Check-In',
        'Appointment marked complete. Visit #' + newTotalVisits + '. Review scheduled.' +
        (isVip ? ' Upgraded to VIP.' : ''));
      return;
    }
  }
}

function _logActivity(ss, clientEmail, actionType, details) {
  const sheet = ss.getSheetByName('Activity Log');
  if (!sheet) return;
  sheet.appendRow([new Date().toISOString(), clientEmail, actionType, details]);
}

// ============================================================
// ============================================================
// SECTION 3 — DEMO DATA
// ============================================================
// ============================================================

function loadDemoData() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert('Load Demo Data',
    'This will add 12 demo clients, 28 demo appointments, and 20 activity log entries.\n\n' +
    'Existing real data will NOT be deleted — demo rows are added below.\n\n' +
    'Use "Clear Demo Data" to remove them later.\n\nContinue?',
    ui.ButtonSet.YES_NO);
  if (result !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tz = Session.getScriptTimeZone();

  // Helper: date string N days ago
  function daysAgo(n) {
    const d = new Date(); d.setDate(d.getDate() - n);
    return Utilities.formatDate(d, tz, 'yyyy-MM-dd');
  }
  function daysFromNow(n) {
    const d = new Date(); d.setDate(d.getDate() + n);
    return Utilities.formatDate(d, tz, 'yyyy-MM-dd');
  }
  function isoNow() { return new Date().toISOString(); }

  // ---- CLIENTS ----
  // Columns: Email, Name, Phone, Service, LeadSource, Referral, Status, Visits, Spend,
  //          LastVisit, NextAppt, LastFU, FUCount, ReviewReq, ReviewLeft, RefAsked,
  //          VIPStatus, Notes, CreatedDate, OptedOut
  const clients = [
    // VIP clients
    ['emma.t@demo.com','Emma Thompson','416-555-0101','Botox','Instagram','','VIP',5,1850,daysAgo(6),'','',0,'Yes','Yes','Yes','VIP','Loves crow\'s feet treatment',daysAgo(365),'No'],
    ['olivia.d@demo.com','Olivia Davis','416-555-0102','HydraFacial','Google','','VIP',4,720,daysAgo(14),'','',0,'Yes','Yes','Yes','VIP','Monthly maintenance client',daysAgo(300),'No'],

    // Active completed
    ['sarah.m@demo.com','Sarah Mitchell','416-555-0103','Filler','Referral','Emma Thompson','Completed',2,1200,daysAgo(3),'','',0,'Yes','No','No','Standard','Lip filler + cheeks',daysAgo(180),'No'],
    ['rachel.w@demo.com','Rachel Williams','416-555-0104','Laser Hair Removal','Website Form','','Completed',3,950,daysAgo(27),'','',0,'Yes','Yes','Yes','Standard','Full legs package',daysAgo(200),'No'],
    ['brittany.m@demo.com','Brittany Moore','416-555-0105','Filler','Instagram','','Completed',2,1200,daysAgo(20),'','',0,'Yes','Yes','No','Standard','Jawline definition',daysAgo(190),'No'],

    // Booked (upcoming)
    ['jessica.p@demo.com','Jessica Park','416-555-0106','HydraFacial','Google','','Booked',0,0,'',daysFromNow(4),'',0,'No','No','No','Standard','',daysAgo(7),'No'],
    ['megan.j@demo.com','Megan Johnson','416-555-0107','Laser Hair Removal','Instagram','','Booked',0,0,'',daysFromNow(2),'',0,'No','No','No','Standard','First appointment',daysAgo(10),'No'],

    // At-risk (60-90 days)
    ['nicole.c@demo.com','Nicole Chen','416-555-0108','Botox','Google','','Completed',2,700,daysAgo(65),'','',0,'Yes','Yes','No','Standard','',daysAgo(220),'No'],
    ['lauren.t@demo.com','Lauren Taylor','416-555-0109','Microneedling','Referral','Rachel Williams','Completed',1,300,daysAgo(80),'','',1,'Yes','No','No','Standard','',daysAgo(85),'No'],

    // Lapsed (90+ days)
    ['stephanie.k@demo.com','Stephanie Kim','416-555-0110','Botox','Instagram','','Lapsed',1,350,daysAgo(140),'','',2,'Yes','No','No','Standard','No-showed on second appt',daysAgo(170),'No'],
    ['ashley.b@demo.com','Ashley Brown','416-555-0111','Body Contouring','Google','','Lapsed',1,500,daysAgo(115),'','',2,'Yes','No','No','Standard','',daysAgo(150),'No'],

    // New inquiries
    ['amanda.f@demo.com','Amanda Foster','416-555-0112','Microneedling','Website Form','','New Inquiry',0,0,'','','',0,'No','No','No','Standard','Interested in acne scarring',daysAgo(2),'No'],
  ];

  const clientSheet = ss.getSheetByName('Clients');
  if (!clientSheet) { ui.alert('Error','Run "Create All Tabs & Headers" first.',ui.ButtonSet.OK); return; }
  clients.forEach(row => clientSheet.appendRow(row));

  // ---- APPOINTMENTS ----
  // Columns: Email, Name, Service, Provider, Date, Time, Status,
  //          PreReminder, PostFU, ReviewSent, Revenue, Notes
  const P = 'Demo Provider'; // provider — rename after loading demo, or edit directly in sheet
  const appts = [
    // Emma Thompson — 5 visits
    ['emma.t@demo.com','Emma Thompson','Botox',P,daysAgo(366),'10:00am','Completed','Yes','Yes','Yes',350,''],
    ['emma.t@demo.com','Emma Thompson','Botox',P,daysAgo(270),'10:00am','Completed','Yes','Yes','Yes',380,''],
    ['emma.t@demo.com','Emma Thompson','Botox',P,daysAgo(180),'10:00am','Completed','Yes','Yes','Yes',360,''],
    ['emma.t@demo.com','Emma Thompson','Botox',P,daysAgo(90),'2:00pm','Completed','Yes','Yes','Yes',380,''],
    ['emma.t@demo.com','Emma Thompson','Botox',P,daysAgo(6),'2:00pm','Completed','Yes','Yes','Yes',380,''],

    // Olivia Davis — 4 visits
    ['olivia.d@demo.com','Olivia Davis','HydraFacial',P,daysAgo(180),'11:00am','Completed','Yes','Yes','Yes',180,''],
    ['olivia.d@demo.com','Olivia Davis','HydraFacial',P,daysAgo(120),'11:00am','Completed','Yes','Yes','Yes',180,''],
    ['olivia.d@demo.com','Olivia Davis','HydraFacial',P,daysAgo(60),'11:00am','Completed','Yes','Yes','Yes',180,''],
    ['olivia.d@demo.com','Olivia Davis','HydraFacial',P,daysAgo(14),'11:00am','Completed','Yes','Yes','Yes',180,''],

    // Sarah Mitchell — 2 visits
    ['sarah.m@demo.com','Sarah Mitchell','Dermal Filler',P,daysAgo(90),'1:00pm','Completed','Yes','Yes','Yes',600,'Lip & cheek'],
    ['sarah.m@demo.com','Sarah Mitchell','Dermal Filler',P,daysAgo(3),'1:00pm','Completed','Yes','Yes','Yes',600,'Touch-up'],

    // Rachel Williams — 3 visits
    ['rachel.w@demo.com','Rachel Williams','Laser Hair Removal',P,daysAgo(120),'3:00pm','Completed','Yes','Yes','Yes',280,'Session 1'],
    ['rachel.w@demo.com','Rachel Williams','Laser Hair Removal',P,daysAgo(80),'3:00pm','Completed','Yes','Yes','Yes',390,'Session 2'],
    ['rachel.w@demo.com','Rachel Williams','Laser Hair Removal',P,daysAgo(27),'3:00pm','Completed','Yes','Yes','Yes',280,'Session 3'],

    // Brittany Moore — 2 visits
    ['brittany.m@demo.com','Brittany Moore','Dermal Filler',P,daysAgo(80),'12:00pm','Completed','Yes','Yes','Yes',600,'Jawline'],
    ['brittany.m@demo.com','Brittany Moore','Dermal Filler',P,daysAgo(20),'12:00pm','Completed','Yes','Yes','Yes',600,'Top-up'],

    // Booked — upcoming
    ['jessica.p@demo.com','Jessica Park','HydraFacial',P,daysFromNow(4),'10:00am','Scheduled','No','No','No','',''],
    ['megan.j@demo.com','Megan Johnson','Laser Hair Removal',P,daysFromNow(2),'2:00pm','Scheduled','No','No','No','',''],

    // Nicole Chen — at-risk
    ['nicole.c@demo.com','Nicole Chen','Botox',P,daysAgo(130),'11:00am','Completed','Yes','Yes','Yes',350,''],
    ['nicole.c@demo.com','Nicole Chen','Botox',P,daysAgo(65),'11:00am','Completed','Yes','Yes','Yes',350,''],

    // Lauren Taylor — at-risk
    ['lauren.t@demo.com','Lauren Taylor','Microneedling',P,daysAgo(80),'4:00pm','Completed','Yes','Yes','No',300,'First session'],

    // Stephanie Kim — lapsed + no-show
    ['stephanie.k@demo.com','Stephanie Kim','Botox',P,daysAgo(140),'2:00pm','Completed','Yes','Yes','Yes',350,'First visit'],
    ['stephanie.k@demo.com','Stephanie Kim','Botox',P,daysAgo(100),'2:00pm','No-Show','Yes','Yes','No',0,'No-showed — recovery email sent'],

    // Ashley Brown — lapsed
    ['ashley.b@demo.com','Ashley Brown','Body Contouring',P,daysAgo(115),'10:00am','Completed','Yes','Yes','Yes',500,'CoolSculpting consult'],

    // Extra no-shows for no-show recovery section
    ['rachel.w@demo.com','Rachel Williams','Laser Hair Removal',P,daysAgo(50),'3:00pm','No-Show','Yes','No','No',0,'Cancelled same day — no recovery sent'],
  ];

  const apptSheet = ss.getSheetByName('Appointments');
  if (!apptSheet) { ui.alert('Error','Appointments sheet missing.',ui.ButtonSet.OK); return; }
  // Demo rows are 12 cols (legacy layout). Insert the 24hr Reminder Sent column
  // at index 8 (mirrors Pre-Appt Reminder Sent). New layout is 13 cols.
  appts.forEach(row => {
    const expanded = row.slice(0, 8).concat([row[7]]).concat(row.slice(8));
    apptSheet.appendRow(expanded);
  });

  // ---- ACTIVITY LOG ----
  const logs = [
    [daysAgo(2) + 'T09:00:00Z', 'amanda.f@demo.com',    'New Inquiry',        'New inquiry for Microneedling via Website Form. Service info email sent.'],
    [daysAgo(3) + 'T09:01:00Z', 'sarah.m@demo.com',     'Post-Appt Check-In', 'Post-appointment check-in sent for Dermal Filler (visit #2).'],
    [daysAgo(3) + 'T09:01:05Z', 'sarah.m@demo.com',     'Review Request',     'Review request sent 24h after Dermal Filler appointment.'],
    [daysAgo(6) + 'T09:00:00Z', 'emma.t@demo.com',      'Post-Appt Check-In', 'Post-appointment check-in sent for Botox (visit #5).'],
    [daysAgo(6) + 'T09:00:05Z', 'emma.t@demo.com',      'Review Request',     'Review request + referral ask sent (VIP, visit #5).'],
    [daysAgo(7) + 'T09:00:00Z', 'jessica.p@demo.com',   'New Inquiry',        'New inquiry for HydraFacial via Google. Service info email sent.'],
    [daysAgo(10)+ 'T09:00:00Z', 'megan.j@demo.com',     'New Inquiry',        'New inquiry for Laser Hair Removal via Instagram. Service info email sent.'],
    [daysAgo(14)+ 'T09:00:00Z', 'olivia.d@demo.com',    'Post-Appt Check-In', 'Post-appointment check-in sent for HydraFacial (visit #4).'],
    [daysAgo(14)+ 'T09:00:05Z', 'olivia.d@demo.com',    'Review Request',     'Review request + referral ask sent (VIP, visit #4).'],
    [daysAgo(20)+ 'T09:00:00Z', 'brittany.m@demo.com',  'Post-Appt Check-In', 'Post-appointment check-in sent for Dermal Filler (visit #2).'],
    [daysAgo(27)+ 'T09:00:00Z', 'rachel.w@demo.com',    'Post-Appt Check-In', 'Post-appointment check-in sent for Laser Hair Removal (visit #3).'],
    [daysAgo(48)+ 'T09:00:00Z', 'rachel.w@demo.com',    'Pre-Appt Reminder',  '48hr reminder sent for Laser Hair Removal on ' + daysAgo(50)],
    [daysAgo(49)+ 'T09:00:00Z', 'rachel.w@demo.com',    'Pre-Appt Reminder',  '24hr final reminder sent for Laser Hair Removal on ' + daysAgo(50)],
    [daysAgo(50)+ 'T14:00:00Z', 'rachel.w@demo.com',    'No-Show Recovery',   'No-show recovery email sent (missed Laser Hair Removal on ' + daysAgo(50) + ')'],
    [daysAgo(60)+ 'T08:00:00Z', 'system',               'Weekly Report',      'Weekly report sent. Completed: 3, Revenue: $1,180, No-shows: 0, New clients: 1'],
    [daysAgo(65)+ 'T09:00:00Z', 'nicole.c@demo.com',    'Post-Appt Check-In', 'Post-appointment check-in sent for Botox (visit #2).'],
    [daysAgo(65)+ 'T09:00:05Z', 'nicole.c@demo.com',    'Review Request',     'Review request + referral ask sent (visit #2).'],
    [daysAgo(80)+ 'T09:00:00Z', 'lauren.t@demo.com',    'Post-Appt Check-In', 'Post-appointment check-in sent for Microneedling (visit #1).'],
    [daysAgo(90)+ 'T10:00:00Z', 'system',               'VIP Re-Engagement',  'LAPSED_60 re-engagement email sent to Nicole Chen (last visit: ' + daysAgo(65) + ')'],
    [daysAgo(90)+ 'T10:00:05Z', 'system',               'VIP Re-Engagement',  'SEASONAL seasonal promo sent to Emma Thompson'],
  ];

  const logSheet = ss.getSheetByName('Activity Log');
  if (!logSheet) { ui.alert('Error','Activity Log sheet missing.',ui.ButtonSet.OK); return; }
  logs.forEach(row => logSheet.appendRow(row));

  ui.alert('✅ Demo Data Loaded!',
    '12 clients, ' + appts.length + ' appointments, and ' + logs.length + ' activity log entries added.\n\n' +
    'Open the dashboard HTML in Chrome to see it all live.\n\n' +
    'Use "Clear Demo Data" when switching to a real client.',
    ui.ButtonSet.OK);
}

function clearDemoData() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.alert('Clear Demo Data',
    'This will remove all rows containing "@demo.com" emails from Clients and Appointments, ' +
    'and all rows with "demo" action types from Activity Log.\n\nContinue?',
    ui.ButtonSet.YES_NO);
  if (result !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let removed = 0;

  ['Clients','Appointments'].forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if ((data[i][0]||'').toString().includes('@demo.com')) {
        sheet.deleteRow(i + 1);
        removed++;
      }
    }
  });

  // Clear demo log entries (client = system + demo emails)
  const logSheet = ss.getSheetByName('Activity Log');
  if (logSheet) {
    const data = logSheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      const email = (data[i][1]||'').toString();
      if (email.includes('@demo.com') || email === 'system') {
        logSheet.deleteRow(i + 1);
        removed++;
      }
    }
  }

  ui.alert('✅ Done', removed + ' demo rows removed.', ui.ButtonSet.OK);
}

// ============================================================
// ABOUT
// ============================================================
function showAbout() {
  SpreadsheetApp.getUi().alert('MedSpa Growth Engine',
    'Version 2.0 — Master Script\n\n' +
    'This script powers your entire MedSpa Growth Engine setup:\n\n' +
    '🛠️ Setup → Create tabs, headers, formatting\n' +
    '🎭 Setup → Load/clear demo data for testing\n' +
    '✅ Operations → Mark appointment complete (fires n8n review workflow)\n' +
    '➕ Operations → Add new appointment row quickly\n\n' +
    'Configure N8N_WEBHOOK_COMPLETE and GOOGLE_REVIEW_LINK at the top of this script.\n\n' +
    'Built with n8n + Gmail + Google Sheets.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}
