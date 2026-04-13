const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const neon = new Client({connectionString: 'postgresql://neondb_owner:npg_hxsmTM4uynr2@ep-odd-boat-amaeuohh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require'});
neon.connect().then(async () => {
    try {
        const r = await neon.query("SELECT * FROM appointments;");
        console.log("Appointments encontradas en Neon:", r.rows.length);
        console.log(r.rows.slice(0, 2));
    } catch (e) {
        console.log("Error querying directly:", e.message);
        // Try with quotes
        try {
             const r2 = await neon.query('SELECT * FROM "Appointments";');
             console.log("Found with quotes!", r2.rows.length);
        } catch(e2) {
             console.log("Error querying with quotes:", e2.message);
        }
    }
    neon.end();
}).catch(console.error);
