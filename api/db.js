import postgres from 'postgres';
import 'dotenv/config';

export const sql = postgres({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'accrual',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'godzilla2026',
});
