const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const row = db.prepare("SELECT id, status, hex(status) as h FROM reminders WHERE id = 1").get();
console.log(row);
