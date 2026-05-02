const Database = require('better-sqlite3');
const path = require('path');
const { DateTime } = require('luxon');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const now = DateTime.now().setZone('America/Mexico_City').toISO()?.substring(0, 16);
console.log('Current system time:', now);

const reminders = db.prepare("SELECT * FROM reminders WHERE status = 'pending'").all();
console.log('Pending Reminders:');
console.table(reminders);

const due = reminders.filter(r => r.time <= now);
console.log('Due Reminders (JS filter):');
console.table(due);
