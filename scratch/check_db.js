const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../backend/data/database.db');
const db = new Database(dbPath);

const rows = db.prepare('SELECT * FROM settings').all();
console.log('Current Settings in DB:');
console.log(JSON.stringify(rows, null, 2));
