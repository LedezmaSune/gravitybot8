const Database = require('better-sqlite3');
const path = require('path');
const { DateTime } = require('luxon');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const now = DateTime.now().setZone('America/Mexico_City').toISO()?.substring(0, 16);
console.log('Querying for time <=', now);

const allPending = db.prepare("SELECT id, time, status FROM reminders WHERE status = 'pending'").all();
console.log('All Pending in DB:', allPending.length);
allPending.forEach(r => {
    const isDue = r.time <= now;
    console.log(`ID: ${r.id} | Time: "${r.time}" | IsDue: ${isDue}`);
});

const results = db.prepare("SELECT id FROM reminders WHERE status = 'pending' AND time <= ?").all(now);
console.log('SQL Results:', results.map(r => r.id));
