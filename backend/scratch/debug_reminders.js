const Database = require('better-sqlite3');
const path = require('path');
const { DateTime } = require('luxon');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const now = DateTime.now().setZone('America/Mexico_City').toISO()?.substring(0, 16);
console.log('Current system time (America/Mexico_City):', now);

const reminders = db.prepare("SELECT * FROM reminders").all();
console.log('\nAll Reminders:');
console.table(reminders);

const pending = db.prepare("SELECT * FROM reminders WHERE status = 'pending' AND time <= ?").all(now);
console.log('\nPending and Due Reminders:');
console.table(pending);
