const { Client } = require('pg');

async function migrate() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const neon = new Client({ connectionString: 'postgresql://neondb_owner:npg_hxsmTM4uynr2@ep-odd-boat-amaeuohh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require' });
    const local = new Client({ connectionString: 'postgresql://postgres:godzilla2026@localhost/accrual' });

    await neon.connect();
    await local.connect();

    const tablesRes = await neon.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
    for (const row of tablesRes.rows) {
        const t = row.table_name;
        console.log('Migrando ' + t);
        
        try {
            const colsRes = await neon.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name=$1`, [t]);
            let colDefs = colsRes.rows.map(c => `"${c.column_name}" ${c.data_type === 'character varying' ? 'VARCHAR' : c.data_type}`).join(', ');
            await local.query(`CREATE TABLE IF NOT EXISTS "${t}" (${colDefs})`);

            const dataRes = await neon.query(`SELECT * FROM "${t}"`);
            for(let dRow of dataRes.rows) {
                const ObjectKeys = Object.keys(dRow);
                const ObjectValues = Object.values(dRow);
                const placeholders = ObjectValues.map((_, i) => '$' + (i+1)).join(', ');
                try {
                    await local.query(`INSERT INTO "${t}" ("${ObjectKeys.join('", "')}") VALUES (${placeholders})`, ObjectValues);
                } catch(e) { }
            }
        } catch (e) {
            console.error('Error on table ' + t, e.message);
        }
    }
    console.log('Data Pull completado y replicado.');
    await neon.end();
    await local.end();
}
migrate().catch(console.error);
