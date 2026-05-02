const { DateTime } = require('luxon');
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('data/database.db');
const db = new Database(dbPath);

const now = DateTime.now().setZone('America/Mexico_City');
const nowStr = now.toISO()?.substring(0, 16);

console.log('Now:', nowStr);

const allPending = db.prepare("SELECT * FROM reminders WHERE status = 'pending'").all();
console.log('Total pending:', allPending.length);

const due = [];
for (const r of allPending) {
    let reminderTime = r.time;
    let label = '';
    
    if (reminderTime === 'inmediato' || reminderTime === 'ahora' || reminderTime === 'inmediatamente') {
        due.push(r);
        label = ' (MATCH: inmediato)';
    } else if (reminderTime.includes('mañana')) {
        const tomorrow = now.plus({ days: 1 }).toFormat('yyyy-MM-dd');
        const timeMatch = reminderTime.match(/(\d{1,2}):(\d{2})/);
        const timePart = timeMatch ? `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}` : '08:00';
        reminderTime = `${tomorrow}T${timePart}`;
        label = ` (TRANSFORM: ${r.time} -> ${reminderTime})`;
    } else if (reminderTime.length === 5 && reminderTime.includes(':')) {
        reminderTime = `${now.toFormat('yyyy-MM-dd')}T${reminderTime}`;
        label = ` (TRANSFORM: ${r.time} -> ${reminderTime})`;
    }

    if (reminderTime <= nowStr) {
        if (!label.includes('MATCH')) due.push(r);
        console.log(`ID: ${r.id} | Original: ${r.time} | Final: ${reminderTime} | DUE: YES${label}`);
    } else {
        console.log(`ID: ${r.id} | Original: ${r.time} | Final: ${reminderTime} | DUE: NO${label}`);
    }
}

console.log('\nTotal due in this mock run:', due.length);
