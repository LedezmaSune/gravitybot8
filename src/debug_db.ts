import { db } from './core/memory';

async function check() {
    const rows = db.prepare('SELECT * FROM settings').all();
    console.log('--- DATABASE SETTINGS ---');
    console.log(JSON.stringify(rows, null, 2));
    console.log('-------------------------');
}

check().catch(console.error);
