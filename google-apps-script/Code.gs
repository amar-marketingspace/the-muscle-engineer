/**
 * ============================================================
 *  THE MUSCLE ENGINEER — Contact Form Backend (Google Apps Script)
 * ============================================================
 *  What this does:
 *    1. Receives every contact-form submission from the website.
 *    2. Saves it as a new row in a sheet tab called "Leads"
 *       (the tab is created automatically on the first lead).
 *    3. Emails you the lead instantly at NOTIFY_EMAIL.
 *
 *  How to install (full walkthrough with screenshots-level detail
 *  is in SETUP-GUIDE.md — short version):
 *    1. Create a new Google Sheet (any name, e.g. "TME Leads").
 *    2. In the Sheet: Extensions > Apps Script.
 *    3. Delete any code you see there and paste THIS ENTIRE FILE.
 *    4. Click Deploy > New deployment > type: Web app.
 *         - Description: anything
 *         - Execute as:  Me
 *         - Who has access:  Anyone
 *       Click Deploy, approve the permissions, and COPY the
 *       "Web app URL" Google shows you.
 *    5. Open index.html, search for
 *       PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
 *       and paste that URL between the quotes. Done.
 *
 *  NOTE: if you ever edit this script later, you must publish the
 *  change via Deploy > Manage deployments > (pencil icon) >
 *  Version: New version > Deploy. Saving alone is not enough.
 * ============================================================
 */

// The sheet tab where leads are stored (created automatically).
var SHEET_NAME = 'Leads';

// Where the instant email notification goes.
var NOTIFY_EMAIL = 'founder.themuscleengineer@gmail.com';

/**
 * Handles POST requests from the website's contact form.
 */
function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Honeypot: the hidden "company" field is invisible to humans.
    // If it has a value, a bot filled it — quietly accept and discard.
    if (p.company) {
      return jsonResponse({ result: 'success' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // First ever lead: create the tab and a formatted header row.
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'Full Name', 'Age', 'Gender', 'Occupation',
        'Email', 'WhatsApp', 'City / State', 'Goal', 'Message'
      ]);
      sheet.getRange(1, 1, 1, 10)
        .setFontWeight('bold')
        .setBackground('#E8221A')
        .setFontColor('#F8F8F6');
      sheet.setFrozenRows(1);
    }

    var row = [
      new Date(),
      p.name || '',
      p.age || '',
      p.gender || '',
      p.occupation || '',
      p.email || '',
      p.whatsapp || '',
      p.city || '',
      p.goal || '',
      p.message || ''
    ];
    sheet.appendRow(row);

    // Instant email notification.
    try {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: 'New Lead — ' + (p.name || 'Unknown') + ' (' + (p.goal || 'No goal selected') + ')',
        htmlBody: buildEmailBody(p)
      });
    } catch (mailErr) {
      // Email failing should never lose the lead — it is already in the Sheet.
      console.error('Email notification failed: ' + mailErr);
    }

    return jsonResponse({ result: 'success' });

  } catch (err) {
    console.error('doPost failed: ' + err);
    return jsonResponse({ result: 'error', message: String(err) });
  }
}

/**
 * Builds the HTML email sent for each new lead.
 */
function buildEmailBody(p) {
  var rows = [
    ['Full Name', p.name], ['Age', p.age], ['Gender', p.gender],
    ['Occupation', p.occupation], ['Email', p.email],
    ['WhatsApp', p.whatsapp], ['City / State', p.city],
    ['Goal', p.goal], ['Message', p.message]
  ];
  var tr = rows.map(function (r) {
    return '<tr>'
      + '<td style="padding:8px 14px;border:1px solid #ddd;background:#f7f7f7;font-weight:bold;white-space:nowrap">' + r[0] + '</td>'
      + '<td style="padding:8px 14px;border:1px solid #ddd">' + escapeHtml(r[1] || '-') + '</td>'
      + '</tr>';
  }).join('');
  var waLink = '';
  if (p.whatsapp) {
    var digits = String(p.whatsapp).replace(/[^0-9]/g, '');
    if (digits.length === 10) digits = '91' + digits; // assume India if no country code
    waLink = '<p style="margin-top:18px"><a href="https://wa.me/' + digits
      + '" style="background:#E8221A;color:#fff;padding:11px 22px;text-decoration:none;font-weight:bold">Reply on WhatsApp</a></p>';
  }
  return '<div style="font-family:Arial,sans-serif;color:#111">'
    + '<h2 style="color:#E8221A;margin:0 0 4px">New lead from the website</h2>'
    + '<p style="margin:0 0 16px;color:#666">Submitted ' + new Date().toLocaleString() + '</p>'
    + '<table style="border-collapse:collapse;font-size:14px">' + tr + '</table>'
    + waLink
    + '</div>';
}

/**
 * Basic HTML escaping for the email body.
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Wraps an object as a JSON response.
 */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Visiting the web app URL in a browser shows this —
 * a quick way to confirm the deployment is alive.
 */
function doGet() {
  return ContentService.createTextOutput(
    'The Muscle Engineer lead handler is running. The website posts form submissions here.'
  );
}
