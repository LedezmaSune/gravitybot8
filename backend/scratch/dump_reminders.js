const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const reminders = db.prepare("SELECT * FROM reminders").all();
console.log('Total reminders:', reminders.length);
reminders.forEach(r => {
    console.log(`ID: ${r.id} | Status: ${r.status} | Time: ${r.time} | Text: ${r.text}`);
});
