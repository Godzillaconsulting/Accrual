import { neon } from '@neondatabase/serverless';
import fs from 'fs';
const sql = neon(process.env.DATABASE_URL);

async function check() {
    const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'appointments';
    `;
    fs.writeFileSync('schema_out.json', JSON.stringify(columns, null, 2));
}
check();
