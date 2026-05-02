const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const reminders = db.prepare("SELECT id, time, hex(time) as h FROM reminders").all();
console.table(reminders);
