const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const audits = db.prepare("SELECT * FROM audits ORDER BY timestamp DESC LIMIT 20").all();
console.log('Last 20 Audits:');
console.table(audits.map(a => ({ ...a, details: JSON.parse(a.details) })));
