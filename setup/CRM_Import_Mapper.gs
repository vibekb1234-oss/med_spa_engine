/**
 * MedSpa Growth Engine — CRM Import Mapper
 *
 * Ingests a CSV from any of the top 5 MedSpa booking systems (Fresha, Jane,
 * Mindbody, Boulevard, Square Appointments) or a generic CSV, normalizes to
 * MGE Sheet schema, dedupes by email, and writes to the Clients tab.
 *
 * Safety: Runs in dry-run mode by default. Writes NOTHING until you flip
 * IMPORT_MODE to 'apply'. See CLIENT_DATA_IMPORT_SOP.md for full workflow.
 *
 * Usage: paste into the clinic's Sheet Apps Script, fill in CONFIG block,
 * upload their CRM export to Drive, put the Drive file ID in CSV_FILE_ID,
 * run importFromCRM(). First run: dry_run. Second run: apply.
 */

// ============================================================
// CONFIG — fill in per import
// ============================================================
const IMPORT_CONFIG = {
  SOURCE_CRM:  'fresha',      // 'fresha' | 'jane' | 'mindbody' | 'boulevard' | 'square' | 'generic'
  IMPORT_MODE: 'dry_run',      // 'dry_run' (safe preview) | 'apply' (writes) | 'incremental' (only new since last import)
  CSV_FILE_ID: 'YOUR_DRIVE_FILE_ID',  // From the URL of the uploaded CSV in Drive
  CLINIC_TZ:   'America/New_York',
  ADD_QUIET_PERIOD_DAYS: 14,   // Days to suppress W4 sends after import
  DEFAULT_LEAD_SOURCE: 'CRM Import',
  OPT_OUT_ALSO_FROM_CSV: null, // Optional: Drive file ID of a separate unsubscribe CSV (Mailchimp/Klaviyo export)
};

// ============================================================
// Field mapping tables per CRM
// ============================================================
const CRM_MAPPINGS = {
  fresha: {
    email:     ['Email', 'Email Address'],
    name:      ['Full Name', 'Name'],
    first:     ['First Name'],
    last:      ['Last Name'],
    phone:     ['Phone', 'Mobile Phone', 'Phone Number'],
    spend:     ['Total Sales', 'Total Spend', 'Lifetime Value'],
    visits:    ['Total Bookings', 'Total Appointments'],
    lastVisit: ['Last Booking Date', 'Last Visit'],
    optOut:    ['Newsletter Opt-Out', 'Marketing Opt-Out'],
    service:   ['Category', 'Preferred Service', 'Last Service'],
    notes:     ['Notes', 'Client Notes'],
  },
  jane: {
    email:     ['Email', 'Email Address'],
    name:      ['Full Name', 'Patient Name'],
    first:     ['First Name'],
    last:      ['Last Name'],
    phone:     ['Primary Phone', 'Phone', 'Mobile'],
    spend:     ['Total Revenue', 'Total Charges'],
    visits:    ['Total Appointments', 'Appointment Count'],
    lastVisit: ['Last Appointment', 'Last Visit Date'],
    optOut:    ['Marketing Consent'],  // inverse: True=opted_in, False=opted_out
    optOutInverse: true,
    service:   ['Discipline', 'Service Type'],
    notes:     ['Notes'],
  },
  mindbody: {
    email:     ['Email', 'Email Address'],
    name:      ['Client Name', 'Full Name'],
    first:     ['First Name'],
    last:      ['Last Name'],
    phone:     ['Mobile Phone', 'Home Phone', 'Phone'],
    spend:     ['Total Revenue', 'Lifetime Revenue'],
    visits:    ['Visit Count', 'Total Visits'],
    lastVisit: ['Last Visit', 'Last Visit Date'],
    optOut:    ['Email Opt In'],  // inverse
    optOutInverse: true,
    service:   ['Preferred Service', 'Service'],
    notes:     ['Notes'],
  },
  boulevard: {
    email:     ['Primary Email', 'Email'],
    name:      ['Full Name'],
    first:     ['First Name'],
    last:      ['Last Name'],
    phone:     ['Mobile Phone', 'Primary Phone'],
    spend:     ['Total Spent', 'Total Revenue'],
    visits:    ['Total Visits', 'Visit Count'],
    lastVisit: ['Last Visit Date', 'Last Appointment'],
    optOut:    ['Marketing Consent'],  // inverse
    optOutInverse: true,
    service:   ['Tags', 'Preferred Service'],
    notes:     ['Notes'],
  },
  square: {
    email:     ['Email Address', 'Email'],
    name:      ['Customer Name', 'Full Name'],
    first:     ['First Name', 'Given Name'],
    last:      ['Last Name', 'Family Name'],
    phone:     ['Phone Number', 'Phone'],
    // Square doesn't reliably export spend/visits/lastVisit
    optOut:    ['Marketing Opt-In'],
    optOutInverse: true,
    notes:     ['Reference ID', 'Notes'],
  },
  generic: {
    email:     ['email', 'client email', 'email address', 'e-mail'],
    name:      ['name', 'client name', 'full name', 'customer name'],
    first:     ['first name', 'given name', 'firstname'],
    last:      ['last name', 'family name', 'surname', 'lastname'],
    phone:     ['phone', 'phone number', 'mobile', 'mobile phone', 'cell'],
    spend:     ['total spend', 'lifetime value', 'total revenue', 'ltv'],
    visits:    ['total visits', 'visit count', 'total appointments'],
    lastVisit: ['last visit date', 'last visit', 'last appointment'],
    optOut:    ['opted out', 'unsubscribed', 'opt out', 'do not contact'],
    service:   ['service interest', 'service', 'category', 'preferred service'],
    notes:     ['notes'],
  }
};

// ============================================================
// Main entry point
// ============================================================
function importFromCRM() {
  const startTime = new Date();
  const mode = IMPORT_CONFIG.IMPORT_MODE;
  console.log(`═══════════════════════════════════════════════════`);
  console.log(`CRM IMPORT — ${IMPORT_CONFIG.SOURCE_CRM.toUpperCase()} — mode: ${mode}`);
  console.log(`═══════════════════════════════════════════════════\n`);

  // 1. Load CSV
  const csvRows = _loadCsv_(IMPORT_CONFIG.CSV_FILE_ID);
  if (csvRows.length === 0) {
    console.log('❌ CSV was empty or unreadable. Aborting.');
    return;
  }
  console.log(`✓ Loaded ${csvRows.length - 1} rows from CSV (excluding header)`);

  // 2. Detect field mapping
  const headers = csvRows[0];
  const mapping = CRM_MAPPINGS[IMPORT_CONFIG.SOURCE_CRM] || CRM_MAPPINGS.generic;
  const cols = _resolveMappings_(headers, mapping);
  const missingCritical = [];
  if (cols.email === -1) missingCritical.push('email');
  if (cols.name === -1 && cols.first === -1) missingCritical.push('name');
  if (missingCritical.length) {
    console.log(`❌ CSV missing critical columns: ${missingCritical.join(', ')}. Aborting.`);
    return;
  }
  console.log(`✓ Field mapping resolved`);

  // 3. Load existing Clients tab for dedupe
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const clientsTab = ss.getSheetByName('Clients');
  if (!clientsTab) {
    console.log('❌ Clients tab not found. Run setupMedSpaEngine() first.');
    return;
  }
  const existing = clientsTab.getDataRange().getValues();
  const existingHeaders = existing[0];
  const emailColIdx = existingHeaders.indexOf('Client Email');
  const existingEmails = new Set(
    existing.slice(1).map(r => (r[emailColIdx] || '').toString().toLowerCase().trim())
  );
  console.log(`✓ Existing Clients tab has ${existingEmails.size} rows`);

  // 4. Optional: load separate opt-out CSV (Mailchimp/Klaviyo export)
  const externalOptOuts = new Set();
  if (IMPORT_CONFIG.OPT_OUT_ALSO_FROM_CSV) {
    try {
      const optRows = _loadCsv_(IMPORT_CONFIG.OPT_OUT_ALSO_FROM_CSV);
      optRows.slice(1).forEach(r => {
        (r || []).forEach(cell => {
          if (typeof cell === 'string' && cell.includes('@')) {
            externalOptOuts.add(cell.toLowerCase().trim());
          }
        });
      });
      console.log(`✓ Loaded ${externalOptOuts.size} external opt-outs from separate CSV`);
    } catch (e) {
      console.log(`⚠ Could not load external opt-out CSV: ${e.message}`);
    }
  }

  // 5. Process each source row
  const toAdd = [];
  const toUpdate = [];
  const skipped = [];
  const stats = { optOuts: 0, invalidEmail: 0, phoneOnly: 0, totalRevenue: 0, totalVisits: 0 };

  for (let i = 1; i < csvRows.length; i++) {
    const row = csvRows[i];
    const parsed = _parseRow_(row, cols, mapping);

    // Validate email
    if (!parsed.email || !_isValidEmail_(parsed.email)) {
      if (parsed.phone) {
        // Convert to phone-only sentinel
        parsed.email = `phone_ONLY_${parsed.phone.replace(/\D/g,'')}@no-email.local`;
        parsed.optedOut = 'Yes';  // Can't email them anyway
        stats.phoneOnly++;
      } else {
        skipped.push({ row: i + 1, reason: 'No email and no phone' });
        stats.invalidEmail++;
        continue;
      }
    }

    // Cross-reference external opt-out list
    if (externalOptOuts.has(parsed.email)) {
      parsed.optedOut = 'Yes';
    }
    if (parsed.optedOut === 'Yes') stats.optOuts++;

    // Track cumulative stats
    stats.totalRevenue += parsed.spend || 0;
    stats.totalVisits += parsed.visits || 0;

    // Dedupe: add or update
    if (existingEmails.has(parsed.email)) {
      toUpdate.push(parsed);
    } else {
      toAdd.push(parsed);
      existingEmails.add(parsed.email);  // Prevent within-import dupes
    }
  }

  // 6. Report
  console.log(`\n─── DRY RUN SUMMARY ───`);
  console.log(`  Rows in CSV:       ${csvRows.length - 1}`);
  console.log(`  Would ADD:         ${toAdd.length} new client rows`);
  console.log(`  Would UPDATE:      ${toUpdate.length} existing rows (email matched)`);
  console.log(`  SKIPPED:           ${skipped.length}`);
  console.log(`    → invalid email: ${stats.invalidEmail}`);
  console.log(`  Phone-only rows:   ${stats.phoneOnly} (marked opted-out, sentinel email)`);
  console.log(`  Opt-outs preserved: ${stats.optOuts}`);
  console.log(`  Historical revenue: $${stats.totalRevenue.toLocaleString()}`);
  console.log(`  Historical visits:  ${stats.totalVisits}`);

  if (skipped.length > 0 && skipped.length <= 10) {
    console.log(`\n  Skipped detail (first 10):`);
    skipped.slice(0, 10).forEach(s => console.log(`    row ${s.row}: ${s.reason}`));
  }

  // 7. Apply if not dry run
  if (mode === 'dry_run') {
    console.log(`\n✓ DRY RUN complete. No changes made.`);
    console.log(`  To apply, change IMPORT_CONFIG.IMPORT_MODE to 'apply' and re-run.`);
    return { toAdd: toAdd.length, toUpdate: toUpdate.length, skipped: skipped.length };
  }

  if (mode === 'incremental' && toAdd.length + toUpdate.length === 0) {
    console.log(`\n✓ INCREMENTAL run — no new data to import.`);
    return { toAdd: 0, toUpdate: 0, skipped: skipped.length };
  }

  console.log(`\n─── APPLYING CHANGES ───`);

  // 7a. Bulk append new rows
  if (toAdd.length > 0) {
    const rowsToAppend = toAdd.map(p => _rowFromParsed_(p, existingHeaders));
    const startRow = clientsTab.getLastRow() + 1;
    clientsTab.getRange(startRow, 1, rowsToAppend.length, existingHeaders.length).setValues(rowsToAppend);
    console.log(`  ✓ Appended ${toAdd.length} new client rows starting at row ${startRow}`);
  }

  // 7b. Update existing rows (by email match)
  let updatedCount = 0;
  if (toUpdate.length > 0) {
    const emailToRowIdx = {};
    existing.slice(1).forEach((r, idx) => {
      const e = (r[emailColIdx] || '').toString().toLowerCase().trim();
      if (e) emailToRowIdx[e] = idx + 2;  // +2 because we sliced off header + arrays are 0-indexed
    });

    for (const p of toUpdate) {
      const rowIdx = emailToRowIdx[p.email];
      if (!rowIdx) continue;
      // Only update fields we have new data for — don't wipe existing values
      const fields = {
        'Last Visit Date': p.lastVisit,
        'Total Visits':    p.visits,
        'Total Spend':     p.spend,
        'Opted Out':       p.optedOut === 'Yes' ? 'Yes' : undefined  // Don't downgrade Yes→No
      };
      Object.entries(fields).forEach(([col, val]) => {
        if (val === undefined || val === null || val === '') return;
        const colIdx = existingHeaders.indexOf(col);
        if (colIdx === -1) return;
        clientsTab.getRange(rowIdx, colIdx + 1).setValue(val);
      });
      updatedCount++;
    }
    console.log(`  ✓ Updated ${updatedCount} existing rows`);
  }

  // 7c. Set quiet period in Config tab
  const configTab = ss.getSheetByName('Config');
  if (configTab && IMPORT_CONFIG.ADD_QUIET_PERIOD_DAYS > 0) {
    const quietUntil = new Date();
    quietUntil.setDate(quietUntil.getDate() + IMPORT_CONFIG.ADD_QUIET_PERIOD_DAYS);
    const quietUntilStr = Utilities.formatDate(quietUntil, IMPORT_CONFIG.CLINIC_TZ, 'yyyy-MM-dd');
    _upsertConfigField_(configTab, 'import_quiet_until', quietUntilStr);
    _upsertConfigField_(configTab, 'import_source_crm', IMPORT_CONFIG.SOURCE_CRM);
    _upsertConfigField_(configTab, 'import_date', new Date().toISOString());
    _upsertConfigField_(configTab, 'import_baseline_client_count', clientsTab.getLastRow() - 1);
    console.log(`  ✓ Config quiet period set: no W4 sends until ${quietUntilStr}`);
  }

  // 7d. Log to Activity Log
  const activityTab = ss.getSheetByName('Activity Log');
  if (activityTab) {
    activityTab.appendRow([
      new Date().toISOString(),
      'CRM_IMPORT_SYSTEM',
      'CRM_IMPORT_COMPLETE',
      'system',
      'Success',
      `Imported ${toAdd.length} new + updated ${updatedCount} from ${IMPORT_CONFIG.SOURCE_CRM}. ${stats.optOuts} opt-outs preserved. Historical: $${stats.totalRevenue.toLocaleString()} across ${stats.totalVisits} visits.`
    ]);
    console.log(`  ✓ Logged to Activity Log`);
  }

  const elapsedSec = ((new Date()) - startTime) / 1000;
  console.log(`\n═══ IMPORT COMPLETE — ${elapsedSec.toFixed(1)}s ═══`);
  return { added: toAdd.length, updated: updatedCount, skipped: skipped.length };
}

// ============================================================
// Helpers
// ============================================================

function _loadCsv_(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const content = file.getBlob().getDataAsString();
    return Utilities.parseCsv(content);
  } catch (e) {
    console.log(`❌ Could not read CSV: ${e.message}`);
    return [];
  }
}

function _resolveMappings_(csvHeaders, mapping) {
  const findCol = (candidateNames) => {
    if (!candidateNames) return -1;
    const arr = Array.isArray(candidateNames) ? candidateNames : [candidateNames];
    for (const candidate of arr) {
      const idx = csvHeaders.findIndex(h => (h || '').toString().toLowerCase().trim() === candidate.toLowerCase());
      if (idx !== -1) return idx;
    }
    return -1;
  };

  return {
    email:     findCol(mapping.email),
    name:      findCol(mapping.name),
    first:     findCol(mapping.first),
    last:      findCol(mapping.last),
    phone:     findCol(mapping.phone),
    spend:     findCol(mapping.spend),
    visits:    findCol(mapping.visits),
    lastVisit: findCol(mapping.lastVisit),
    optOut:    findCol(mapping.optOut),
    service:   findCol(mapping.service),
    notes:     findCol(mapping.notes),
    optOutInverse: mapping.optOutInverse || false
  };
}

function _parseRow_(row, cols, mapping) {
  const get = (idx) => idx >= 0 ? (row[idx] || '').toString().trim() : '';
  const getNum = (idx) => {
    if (idx < 0) return 0;
    const raw = get(idx).replace(/[^0-9.\-]/g, '');
    return raw ? parseFloat(raw) : 0;
  };
  const parseOptOut = (raw) => {
    if (!raw) return '';
    const s = raw.toString().toLowerCase().trim();
    let isOptedOut = ['yes', 'y', 'true', '1', 'opted out', 'unsubscribed'].includes(s);
    if (cols.optOutInverse) isOptedOut = !isOptedOut;
    return isOptedOut ? 'Yes' : '';
  };

  // Name — prefer full name, fall back to first+last
  let name = get(cols.name);
  if (!name && cols.first >= 0) {
    name = [get(cols.first), get(cols.last)].filter(Boolean).join(' ');
  }

  return {
    email:     get(cols.email).toLowerCase(),
    name:      name,
    phone:     _normalizePhone_(get(cols.phone)),
    spend:     getNum(cols.spend),
    visits:    Math.max(0, parseInt(getNum(cols.visits))),
    lastVisit: _normalizeDate_(get(cols.lastVisit)),
    optedOut:  parseOptOut(get(cols.optOut)),
    service:   get(cols.service) || 'General',
    notes:     get(cols.notes)
  };
}

function _rowFromParsed_(p, headers) {
  // Build a row that matches the existing Clients tab's column order.
  const row = new Array(headers.length).fill('');
  const setIf = (colName, value) => {
    const idx = headers.indexOf(colName);
    if (idx !== -1 && value !== undefined && value !== null) row[idx] = value;
  };
  setIf('Client Email', p.email);
  setIf('Client Name', p.name);
  setIf('Phone Number', p.phone);
  setIf('Service Interest', p.service);
  setIf('Lead Source', IMPORT_CONFIG.DEFAULT_LEAD_SOURCE);
  setIf('Status', p.visits > 0 ? 'Completed' : 'New Inquiry');
  setIf('Total Visits', p.visits);
  setIf('Total Spend', p.spend);
  setIf('Last Visit Date', p.lastVisit);
  setIf('VIP Status', p.visits >= 5 ? 'VIP' : 'Standard');
  setIf('Opted Out', p.optedOut || 'No');
  setIf('Review Requested', 'No');
  setIf('Review Left', 'No');
  setIf('Referral Asked', 'No');
  setIf('Follow-Up Count', 0);
  setIf('Notes', p.notes);
  setIf('Created Date', new Date().toISOString());
  return row;
}

function _isValidEmail_(email) {
  if (!email) return false;
  // Basic sanity check + not our sentinel
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !email.includes('phone_ONLY_');
}

function _normalizePhone_(raw) {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits.startsWith('1')) return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  return raw;  // Leave international formats as-is
}

function _normalizeDate_(raw) {
  if (!raw) return '';
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return '';
  return Utilities.formatDate(parsed, IMPORT_CONFIG.CLINIC_TZ, 'yyyy-MM-dd HH:mm:ss');
}

function _upsertConfigField_(configTab, fieldName, value) {
  const data = configTab.getDataRange().getValues();
  const headers = data[0];
  const idx = headers.indexOf(fieldName);
  if (idx === -1) {
    // Field doesn't exist — add it as new column
    configTab.getRange(1, headers.length + 1).setValue(fieldName);
    configTab.getRange(2, headers.length + 1).setValue(value);
  } else {
    // Update existing field in row 2
    configTab.getRange(2, idx + 1).setValue(value);
  }
}

/**
 * Manual dry-run trigger for testing without touching IMPORT_MODE.
 */
function dryRunImport() {
  const originalMode = IMPORT_CONFIG.IMPORT_MODE;
  IMPORT_CONFIG.IMPORT_MODE = 'dry_run';
  const result = importFromCRM();
  IMPORT_CONFIG.IMPORT_MODE = originalMode;
  return result;
}
