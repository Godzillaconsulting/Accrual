const { Client } = require('pg');
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

const neon = new Client({connectionString: 'postgresql://neondb_owner:npg_hxsmTM4uynr2@ep-odd-boat-amaeuohh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require'});
const local = new Client({connectionString: 'postgresql://postgres:godzilla2026@localhost/accrual'});

async function run() {
    await neon.connect();
    await local.connect();

    try {
        const res = await neon.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
        const tables = res.rows.map(r => r.table_name);
        console.log("Tablas en Neon:", tables);

        for (let t of tables) {
            console.log(`\nMigrando tabla: ${t}...`);
            try {
                // Fetch schema info from Neon
                const colRes = await neon.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name=$1", [t]);
                const cols = colRes.rows.map(c => `"${c.column_name}"`);
                const colDefs = colRes.rows.map(c => `"${c.column_name}" ${c.data_type === 'character varying' ? 'VARCHAR(255)' : c.data_type}`).join(', ');

                // Create local table if not exists
                await local.query(`CREATE TABLE IF NOT EXISTS "${t}" (${colDefs})`);

                // Fetch data from Neon
                const dataRes = await neon.query(`SELECT * FROM "${t}"`);
                
                if (dataRes.rows.length > 0) {
                    let importadas = 0;
                    for (let row of dataRes.rows) {
                        const vals = cols.map((c, i) => `$${i+1}`);
                        const values = cols.map((c) => row[c.replace(/"/g, '')]);
                        
                        try {
                            const pkQuery = await local.query(`
                                SELECT a.attname
                                FROM   pg_index i
                                JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                                WHERE  i.indrelid = '"${t}"'::regclass AND i.indisprimary;
                            `).catch(e => ({rows:[]}));
                            
                            let conflictClause = "ON CONFLICT DO NOTHING";
                            if (pkQuery.rows.length > 0) {
                                conflictClause = `ON CONFLICT ("${pkQuery.rows[0].attname}") DO NOTHING`;
                            } else {
                                // Assume id is PK if exists
                                if (cols.includes('"id"')) {
                                    await local.query(`ALTER TABLE "${t}" ADD PRIMARY KEY ("id")`).catch(e=>null);
                                    conflictClause = `ON CONFLICT ("id") DO NOTHING`;
                                }
                            }

                            await local.query(`INSERT INTO "${t}" (${cols.join(',')}) VALUES (${vals.join(',')}) ${conflictClause}`, values);
                            importadas++;
                        } catch(e) {
                            // Si falla por ON CONFLICT sin restriccion unica, insertando directo ignorando duplicados temporalmente
                            try {
                                 await local.query(`INSERT INTO "${t}" (${cols.join(',')}) VALUES (${vals.join(',')})`, values);
                                 importadas++;
                            } catch(innerE) {
                                 console.log(`Error fila tabla ${t}:`, innerE.message);
                            }
                        }
                    }
                    console.log(`✅ ¡Migrados ${importadas}/${dataRes.rows.length} registros de ${t}!`);
                    
                    if (cols.includes('"id"')) {
                        await local.query(`SELECT setval('"${t}_id_seq"', COALESCE((SELECT MAX(id) FROM "${t}"), 1), false)`).catch(e=>null);
                    }

                } else {
                    console.log(`⚠️ Tabla ${t} esta vacia.`);
                }
            } catch (e) {
                console.error(`❌ Error en tabla ${t}:`, e.message);
            }
        }
    } catch (e) {
        console.error("Critical:", e.message);
    }
    await neon.end();
    await local.end();
}
run();
