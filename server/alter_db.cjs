const {Pool} = require('pg');
const pool = new Pool({connectionString: 'postgres://postgres:godzilla2026@localhost:5432/accrual'});
pool.query("ALTER TABLE wa_blacklist ADD COLUMN reason VARCHAR(255) DEFAULT 'Desconocido'").then(() => {
    console.log('Column added');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
