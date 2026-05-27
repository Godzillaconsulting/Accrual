-- ==============================================================================
-- 🚀 ACCRUAL.COM.MX - RESTORE MISSING TABLES & SEED DATA
-- ==============================================================================

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT,
    content TEXT,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed articles if they do not exist
INSERT INTO articles (id, title, image, content, slug)
VALUES 
(1, 'Errores comunes en la declaración de impuestos y cómo evitarlos', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'Conoce los errores más frecuentes que cometen las empresas al momento de declarar sus impuestos y descubre las estrategias clave para evitarlos, ahorrando así dinero y evitando sanciones por parte de la autoridad fiscal.', 'errores-comunes-en-la-declaracion-de-impuestos-y-como-evitarlos'),
(2, 'Beneficios de contratar un asesor fiscal profesional', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'Un asesor fiscal profesional no solo te ayuda a cumplir con tus obligaciones, sino que se convierte en un socio estratégico para maximizar la rentabilidad de tu negocio mediante una planificación inteligente y apegada a la ley.', 'beneficios-de-contratar-un-asesor-fiscal-profesional'),
(3, 'Beneficios del compliance fiscal', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'El compliance fiscal dejó de ser una opción para convertirse en una necesidad. Descubre cómo la implementación de buenas prácticas y controles internos puede proteger el patrimonio de tu empresa frente a auditorías.', 'beneficios-del-compliance-fiscal'),
(4, 'Importancia del presupuesto para la toma de decisiones', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'Un presupuesto bien estructurado es la brújula financiera de cualquier organización. Exploraremos cómo un control presupuestal adecuado permite anticipar escenarios y tomar decisiones gerenciales acertadas.', 'importancia-del-presupuesto-para-la-toma-de-decisiones'),
(5, 'Implicaciones legales de los delitos fiscales', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'Entender las consecuencias penales y económicas de los delitos fiscales es fundamental para los directivos. Analizamos el marco legal actual y las medidas preventivas que toda empresa debe considerar.', 'implicaciones-legales-de-los-delitos-fiscales'),
(6, 'Suspensión de sellos digitales y sus consecuencias', 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'La suspensión de los Certificados de Sello Digital (CSD) paraliza la operation de una empresa. Te explicamos los motivos más comunes por los cuales la autoridad toma esta medida y cómo solucionarlo rápidamente.', 'suspension-de-sellos-digitales-y-sus-consecuencias'),
(7, 'Partes relacionadas y los estudios de precio de transferencia', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'Las operaciones entre partes relacionadas están bajo la lupa de las autoridades fiscales. Descubre por qué es vital contar con estudios de precios de transferencia sólidos y actualizados.', 'partes-relacionadas-y-los-estudios-de-precio-de-transferencia'),
(8, 'Acciones BEPS y la planeación fiscal agresiva', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', 'El plan de acción BEPS (Base Erosion and Profit Shifting) ha transformado la fiscalidad internacional. Analizamos cómo estas directrices combaten la planeación fiscal agresiva y afectan a las empresas multinacionales.', 'acciones-beps-y-la-planeacion-fiscal-agresiva')
ON CONFLICT (id) DO NOTHING;

-- Adjust sequence for serial id in articles
SELECT setval('articles_id_seq', COALESCE((SELECT MAX(id)+1 FROM articles), 1), false);

-- 2. Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    apellidos VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(50),
    mensaje TEXT,
    service_requested VARCHAR(255),
    fecha DATE,
    hora TIME,
    modalidad VARCHAR(50),
    duracion VARCHAR(50),
    precio NUMERIC(10,2),
    status VARCHAR(50) DEFAULT 'confirmada',
    google_calendar_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create accrual_admin_logs table with user_id matching UUID from accrual_admin_users
CREATE TABLE IF NOT EXISTS accrual_admin_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    action VARCHAR(255) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
