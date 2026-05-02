const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const row = db.prepare("SELECT '13:40' <= '2026-05-02T13:42' as result").get();
console.log("SQLite result for '13:40' <= '2026-05-02T13:42' is:", row.result);
