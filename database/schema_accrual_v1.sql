-- ==============================================================================
-- 🚀 ACCRUAL.COM.MX - CORE DATABASE INFRASTRUCTURE
-- ==============================================================================
-- Rol: Senior Database Architect & SQL Optimization Expert
-- Objetivo: Diseño de base de datos relacional para Accrual, sistema multitenant 
--           y back-end para la "Neurona WhatsApp".
-- Dialecto: PostgreSQL (Recomendado para robustez y tipos JSONB)
-- Almacenamiento: Preparado para mapear a Volumen Local en Drive E:
-- ==============================================================================

-- ==========================================
-- FASE 1: ESTRUCTURA CORE DE NEGOCIO (FISCAL)
-- ==========================================

-- 1.1 Clientes Accrual
CREATE TABLE IF NOT EXISTS clients_accrual (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razon_social VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) NOT NULL UNIQUE,
    regimen_fiscal VARCHAR(255) NOT NULL,
    estatus_cumplimiento VARCHAR(50) DEFAULT 'AL_CORRIENTE', -- Estados: AL_CORRIENTE, ALERTA, ATRASADO
    contacto_telefono VARCHAR(20),
    contacto_email VARCHAR(150),
    tenant_id VARCHAR(50) DEFAULT 'ACCRUAL_MX', -- Separador lógico para evitar cruce con Godzilla
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1.2 Subscripciones de Servicios
CREATE TABLE IF NOT EXISTS service_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    paquete_contratado VARCHAR(100) NOT NULL, -- Ej: Posicionamiento, Control IA
    fecha_inicio DATE NOT NULL,
    fecha_renovacion DATE,
    estatus VARCHAR(50) DEFAULT 'ACTIVO',
    CONSTRAINT fk_client_subscription FOREIGN KEY (client_id) 
        REFERENCES clients_accrual(client_id) ON DELETE CASCADE
);

-- 1.3 Gestión de Documentos Fiscales
CREATE TABLE IF NOT EXISTS tax_documents (
    document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    tipo_documento VARCHAR(100) NOT NULL, -- Ej: DECLARACION_MENSUAL, FACTURA, CONSTANCIA
    formato VARCHAR(10) NOT NULL, -- XML, PDF
    archivo_ruta_fisica VARCHAR(1000) NOT NULL, -- Apuntador a Disco E: Ej: E:\Accrual_Docs\RFC\2026\04\...
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    estatus_documento VARCHAR(50) DEFAULT 'VIGENTE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client_tax_doc FOREIGN KEY (client_id) 
        REFERENCES clients_accrual(client_id) ON DELETE CASCADE
);

-- ==========================================
-- FASE 2: INFRAESTRUCTURA PARA BOT DE WHATSAPP
-- ==========================================

-- 2.1 Sesiones de WhatsApp (Neurona Accrual)
CREATE TABLE IF NOT EXISTS wa_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_telefono VARCHAR(20) NOT NULL UNIQUE,
    token_sesion TEXT,
    qr_status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CONNECTED, EXPIRED
    ultima_conexion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.2 Estados del Workflow (Embudo/IA)
CREATE TABLE IF NOT EXISTS wa_workflow_states (
    state_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_contacto VARCHAR(20) NOT NULL UNIQUE,
    etapa_embudo VARCHAR(100) NOT NULL, -- LEAD_ENTRY, CALIFICACION_BOT, COTIZACION, SOPORTE, CIERRE
    contexto_ia JSONB, -- Almacenaje de la memoria a corto plazo del bot (variables, intereses)
    ultima_interaccion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.3 Registro de Mensajes (Log de Interacciones)
CREATE TABLE IF NOT EXISTS wa_messages_log (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    numero_remitente VARCHAR(20) NOT NULL,
    direccion VARCHAR(10) NOT NULL, -- INBOUND (Entrada), OUTBOUND (Salida)
    contenido_mensaje TEXT,
    clasificacion_ia VARCHAR(100), -- Categorización: DUDA_FISCAL, SOPORTE_TECNICO, VENTAS
    estado_lectura VARCHAR(20) DEFAULT 'PENDIENTE', -- PENDIENTE, LEIDO, PROCESADO_POR_IA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wa_session FOREIGN KEY (session_id) 
        REFERENCES wa_sessions(session_id) ON DELETE CASCADE
);

-- ==========================================
-- FASE 3: OPTIMIZACIÓN Y SEGURIDAD LOCAL
-- ==========================================

-- 3.1 Índices de Alta Velocidad (Optimizados para Admin Panel NVMe)
CREATE INDEX IF NOT EXISTS idx_clients_rfc ON clients_accrual(rfc);
CREATE INDEX IF NOT EXISTS idx_clients_telefono ON clients_accrual(contacto_telefono);
CREATE INDEX IF NOT EXISTS idx_tax_docs_vencimiento ON tax_documents(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_wa_messages_estado ON wa_messages_log(estado_lectura);
CREATE INDEX IF NOT EXISTS idx_wa_workflow_etapa ON wa_workflow_states(etapa_embudo);

-- 3.2 Vistas (Views): Generación Calendario Asana-style
-- Esta vista fusiona las alertas fiscales y de pago para mostrarse como "Tarjetas" en el UI.
CREATE OR REPLACE VIEW view_asana_calendar_tasks AS
SELECT 
    c.razon_social,
    c.rfc,
    'FISCAL_ALERT' AS tipo_tarea,
    d.tipo_documento AS titulo_tarea,
    CONCAT('Subir ', d.formato, ' para fecha de corte') AS descripcion,
    d.fecha_vencimiento AS fecha_limite,
    CASE 
        WHEN d.fecha_vencimiento < CURRENT_DATE THEN 'VENCIDO'
        WHEN d.fecha_vencimiento <= CURRENT_DATE + INTERVAL '5 days' THEN 'URGENTE'
        ELSE 'PLANIFICADO'
    END as prioridad_ui
FROM tax_documents d
JOIN clients_accrual c ON d.client_id = c.client_id
WHERE d.estatus_documento != 'ATENDIDO' OR d.fecha_vencimiento IS NULL

UNION ALL

SELECT
    c.razon_social,
    c.rfc,
    'RENOVACION_SERVICIO' AS tipo_tarea,
    s.paquete_contratado AS titulo_tarea,
    'Gestionar pago/renovación del servicio' AS descripcion,
    s.fecha_renovacion AS fecha_limite,
    CASE 
        WHEN s.fecha_renovacion < CURRENT_DATE THEN 'VENCIDO'
        WHEN s.fecha_renovacion <= CURRENT_DATE + INTERVAL '7 days' THEN 'URGENTE'
        ELSE 'PLANIFICADO'
    END as prioridad_ui
FROM service_subscriptions s
JOIN clients_accrual c ON s.client_id = c.client_id
WHERE s.estatus = 'ACTIVO';

-- 3.3 Seguridad: Triggers de Auditoría Básica (Aislamiento de capa datos)
-- Impide modificaciones accidentales o sin rastrear.
CREATE TABLE audit_logs_accrual (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    record_id TEXT,
    usuario_db VARCHAR(50) DEFAULT current_user,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_accrual_changes()
RETURNS trigger AS $$
BEGIN
    INSERT INTO audit_logs_accrual (table_name, action_type, record_id)
    VALUES (
        TG_TABLE_NAME, 
        TG_OP, 
        COALESCE((to_jsonb(NEW)->>'client_id'), (to_jsonb(NEW)->>'document_id'), (to_jsonb(NEW)->>'session_id'), (to_jsonb(NEW)->>'message_id'), 'N/A')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_clients_accrual
AFTER INSERT OR UPDATE OR DELETE ON clients_accrual
FOR EACH ROW EXECUTE FUNCTION log_accrual_changes();

-- 3.4 Procedimientos Almacenados: Motor de la Neurona WhatsApp
-- SP optimizado para el Disco E: (Baja latencia) para inyectar mensajes y actualizar estado en 1 paso
CREATE OR REPLACE PROCEDURE sp_process_incoming_wa_message(
    p_session_id UUID,
    p_numero_remitente VARCHAR(20),
    p_contenido TEXT,
    p_clasificacion_ia VARCHAR(100),
    p_etapa_workflow VARCHAR(100),
    p_contexto_ia JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Bloque Transaccional: Asegura consistencia de los datos del Lead
    
    -- 1. Registrar el mensaje en el log
    INSERT INTO wa_messages_log (
        session_id, numero_remitente, direccion, contenido_mensaje, clasificacion_ia, estado_lectura
    ) VALUES (
        p_session_id, p_numero_remitente, 'INBOUND', p_contenido, p_clasificacion_ia, 'PENDIENTE'
    );

    -- 2. Upsert (Actualizar o Insertar) el estado del embudo para el Engine de IA
    INSERT INTO wa_workflow_states (
        numero_contacto, etapa_embudo, contexto_ia, ultima_interaccion
    ) VALUES (
        p_numero_remitente, p_etapa_workflow, p_contexto_ia, CURRENT_TIMESTAMP
    )
    ON CONFLICT (numero_contacto) DO UPDATE 
    SET 
        etapa_embudo = EXCLUDED.etapa_embudo,
        contexto_ia = EXCLUDED.contexto_ia,
        ultima_interaccion = CURRENT_TIMESTAMP;

    -- Commit automático al salir del bloque
END;
$$;

-- ==========================================
-- FASE 4: USUARIOS DEL PANEL DE ADMINISTRACIÓN
-- ==========================================

-- 4.1 Tipos de Usuarios y Roles (RBAC)
-- super_admin: Todos los privilegios (agregar, cambiar, eliminar pass/usuario).
-- admin: Puede restablecer contraseñas pero no eliminar usuarios/contraseñas.
-- editor: Sólo edita contenido desde el admin panel, no maneja usuarios.

CREATE TABLE IF NOT EXISTS accrual_admin_users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')),
    photo_url VARCHAR(500) DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices para Usuarios
CREATE INDEX IF NOT EXISTS idx_accrual_users_role ON accrual_admin_users(role);

-- Trigger de Auditoría de Usuarios
CREATE TRIGGER trg_audit_admin_users
AFTER INSERT OR UPDATE OR DELETE ON accrual_admin_users
FOR EACH ROW EXECUTE FUNCTION log_accrual_changes();

-- ==========================================
-- FASE 5: CALENDARIO COLABORATIVO (CM / Marketing)
-- ==========================================

-- 5.1 Tabla principal de eventos del calendario
CREATE TABLE IF NOT EXISTS calendar_events (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    platform        VARCHAR(20) DEFAULT 'ALL'
                        CHECK (platform IN ('ALL', 'facebook', 'instagram', 'tiktok')),
    status          VARCHAR(20) DEFAULT 'warning'
                        CHECK (status IN ('warning', 'urgent', 'success')),
    caption         TEXT,
    media_url       TEXT,
    provider        TEXT,
    -- ✅ VALIDACIÓN DE FECHAS: start_date es obligatorio, end_date >= start_date
    start_date      TIMESTAMPTZ NOT NULL,
    end_date        TIMESTAMPTZ,
    CONSTRAINT chk_calendar_dates CHECK (end_date IS NULL OR end_date >= start_date),
    empresa         VARCHAR(50) DEFAULT 'accrual',
    assigned_to     VARCHAR(100),
    created_by      VARCHAR(100),
    comments        JSONB DEFAULT '[]'::jsonb,
    is_rescheduled  BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 Índices de alta velocidad para queries del calendario
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date  ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_platform    ON calendar_events(platform);
CREATE INDEX IF NOT EXISTS idx_calendar_events_empresa     ON calendar_events(empresa);
CREATE INDEX IF NOT EXISTS idx_calendar_events_assigned_to ON calendar_events(assigned_to);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status      ON calendar_events(status);

-- 5.3 Función genérica para auto-actualizar updated_at en cualquier tabla
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5.4 Trigger: Actualiza updated_at automáticamente al editar un evento
CREATE OR REPLACE TRIGGER trg_calendar_events_updated_at
BEFORE UPDATE ON calendar_events
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5.5 Trigger de auditoría (reutiliza la función global log_accrual_changes)
CREATE OR REPLACE TRIGGER trg_audit_calendar_events
AFTER INSERT OR UPDATE OR DELETE ON calendar_events
FOR EACH ROW EXECUTE FUNCTION log_accrual_changes();

-- 5.6 Vista: Eventos próximos con nivel de urgencia para el panel admin
CREATE OR REPLACE VIEW view_calendar_upcoming AS
SELECT
    ce.id,
    ce.title,
    ce.platform,
    ce.status,
    ce.empresa,
    ce.assigned_to,
    ce.start_date,
    ce.end_date,
    ce.is_rescheduled,
    CASE
        WHEN ce.start_date < NOW()                         THEN 'VENCIDO'
        WHEN ce.start_date <= NOW() + INTERVAL '24 hours' THEN 'HOY'
        WHEN ce.start_date <= NOW() + INTERVAL '3 days'   THEN 'ESTA_SEMANA'
        ELSE 'PLANIFICADO'
    END AS urgencia_ui,
    jsonb_array_length(COALESCE(ce.comments, '[]'::jsonb)) AS total_comentarios
FROM calendar_events ce
WHERE ce.start_date >= NOW() - INTERVAL '7 days'
ORDER BY ce.start_date ASC;


