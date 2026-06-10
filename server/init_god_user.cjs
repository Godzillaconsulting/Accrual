const pg = require('pg');
const bcrypt = require('bcryptjs');

const pool = new pg.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'accrual',
    password: process.env.DB_PASSWORD || 'godzilla2026',
    port: process.env.DB_PORT || 5432,
});

async function run() {
    try {
        await pool.query(`
            ALTER TABLE accrual_admin_users DROP CONSTRAINT IF EXISTS accrual_admin_users_role_check;
            ALTER TABLE accrual_admin_users ADD CONSTRAINT accrual_admin_users_role_check CHECK (role IN ('super_admin', 'admin', 'editor', 'god'));
        `);
        console.log("Constraint actualizado.");

        const jaregHash = bcrypt.hashSync('godmode2026', 10);
        const jaregExists = await pool.query("SELECT user_id FROM accrual_admin_users WHERE username = 'jareg'");
        if (jaregExists.rows.length === 0) {
            await pool.query(
                `INSERT INTO accrual_admin_users (username, email, password_hash, role) 
                 VALUES ('jareg', 'jareg@accrual.com.mx', $1, 'god')`,
                [jaregHash]
            );
            console.log("Usuario jareg creado con éxito.");
        } else {
            console.log("Usuario jareg ya existe.");
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        pool.end();
    }
}
run();
