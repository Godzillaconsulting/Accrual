import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const seedData = [
    {
        title: "Beneficios de contratar un asesor fiscal profesional",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        content: `<h3>MAXIMIZACIÓN DE LAS DEDUCCIONES Y ESTÍMULOS FISCALES</h3><p>Un asesor puede identificar deducciones y estímulos fiscales que quizás no sabías que podías reclamar...</p>`
    },
    {
        title: "Beneficios del compliance fiscal",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        content: `<h3>EVITAR MULTAS Y SANCIONES</h3><p>Un cumplimiento adecuado con las normativas fiscales asegura que las empresas o individuos eviten las multas...</p>`
    }
];

async function setup() {
    try {
        console.log('Creando tabla articles...');
        await sql`
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                image TEXT NOT NULL,
                content TEXT NOT NULL,
                slug TEXT UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        console.log('Insertando datos...');
        for (const article of seedData) {
            await sql`
                INSERT INTO articles (title, image, content) 
                VALUES (${article.title}, ${article.image}, ${article.content})
            `;
        }
        console.log('Setup completado.');
    } catch (error) {
        console.error('Error setup DB:', error);
    }
}

setup();
