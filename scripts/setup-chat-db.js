import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function setupChatDB() {
    console.log('Connecting to Neon DB to setup chat_history table...');
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                session_id VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('✅ Table chat_history successfully verified/created.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error setting up chat_history table:', error);
        process.exit(1);
    }
}

setupChatDB();
