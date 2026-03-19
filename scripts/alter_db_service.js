import { sql } from '../api/db.js';

async function alterTable() {
    try {
        await sql`
            ALTER TABLE appointments 
            ADD COLUMN IF NOT EXISTS service_requested VARCHAR(255) DEFAULT 'No especificado';
        `;
        console.log("Table 'appointments' altered successfully to add 'service_requested' column.");
    } catch (e) {
        console.error("Error altering table", e);
    }
}

alterTable();
