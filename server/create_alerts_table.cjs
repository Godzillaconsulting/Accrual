const {Pool} = require('pg');
const pool = new Pool({connectionString: 'postgres://postgres:godzilla2026@localhost:5432/accrual'});
pool.query(`
    CREATE TABLE IF NOT EXISTS accrual_admin_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        action VARCHAR(255) NOT NULL,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`).then(() => {
    console.log('Table created');
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
