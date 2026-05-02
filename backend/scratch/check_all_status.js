const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const reminders = db.prepare("SELECT id, status, time, text FROM reminders").all();
console.table(reminders);
