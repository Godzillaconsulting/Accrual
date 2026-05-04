import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Assuming bot/config/db.js and .env is at Accrual/Accrual/.env

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'accrual',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'godzilla2026',
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;
