import { sql } from '../api/db.js';

async function alterTable() {
    try {
        await sql`
            ALTER TABLE appointments 
            ADD COLUMN IF NOT EXISTS duration VARCHAR(20) DEFAULT '30min';
        `;
        console.log("Table 'appointments' altered successfully to add 'duration' column.");
    } catch (e) {
        console.error("Error altering table", e);
    }
}

alterTable();
