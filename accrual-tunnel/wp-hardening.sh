#!/bin/bash
# ==============================================================================
# WP-CLI Hardening Script: "High Performance Accrual Tunnel"
# ==============================================================================

# Ruta por defecto a la instalación de WP (Asegúrate de ajustar esta variable)
WP_PATH="/var/www/html"

echo "================================================================="
echo "🦍 Iniciando inyección de configuración High Performance WP-CLI..."
echo "================================================================="

# Verificar si WP-CLI está disponible
if ! command -v wp &> /dev/null; then
    echo "⚠️  WP-CLI no encontrado. Por favor instálalo o asegúrate de que esté en el PATH."
    exit 1
fi

# 1. Forzar límites de memoria para sitios Business
echo "-> Forzando límites de memoria (256M/512M)..."
wp config set WP_MEMORY_LIMIT '256M' --path=$WP_PATH
wp config set WP_MAX_MEMORY_LIMIT '512M' --path=$WP_PATH

# 2. Desactivar WP-CRON nativo para mitigar fugas y encolamientos indeseados
echo "-> Desactivando WP-CRON nativo para forzar cron a nivel sistema..."
wp config set DISABLE_WP_CRON true --raw --path=$WP_PATH

# 3. Forzar SSL en Administración y limpieza
echo "-> Forzando SSL en área de administradores..."
wp config set FORCE_SSL_ADMIN true --raw --path=$WP_PATH

# 4. Activar caché general
echo "-> Activando constantes de caché..."
wp config set WP_CACHE true --raw --path=$WP_PATH

# 5. Inyección de reglas Proxy Inverso para Cloudflare Tunnel (Evita bucles de redirección HTTPS/HTTP)
echo "-> Inyectando validación de Tunnel HTTPS & Proxy Headers..."
WP_CONFIG_FILE="$WP_PATH/wp-config.php"

if ! grep -q "HTTP_X_FORWARDED_PROTO" "$WP_CONFIG_FILE"; then
    # Inyectar validaciones seguras directamente antes del comentario stop editing
    sed -i "/stop editing/i \\
/* Configuración de Proxy Inverso (Accrual Cloudflare Tunnel) */\\
if ( isset( \\\$_SERVER['HTTP_X_FORWARDED_PROTO'] ) && \\\$_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ) {\\
    \\\$_SERVER['HTTPS'] = 'on';\\
}\\
if ( isset( \\\$_SERVER['HTTP_X_FORWARDED_HOST'] ) ) {\\
    \\\$_SERVER['HTTP_HOST'] = \\\$_SERVER['HTTP_X_FORWARDED_HOST'];\\
}\\
" "$WP_CONFIG_FILE"
    echo "✔️ Reglas de validación HTTPS inyectadas en wp-config.php."
else
    echo "✔️ Las validaciones proxy HTTPS ya existían en la configuración."
fi

echo "================================================================="
echo "✅ Hardening exitoso. Tu WP está amurallado para el Accrual Tunnel."
echo ""
echo "🔥 IMPORTANTE POST-INSTALL 🔥"
echo "Para el sistema de Cron, abre crontab (-e) y añade para ejecutar cada 5 mins:"
echo "*/5 * * * * curl -s -o /dev/null http://localhost/wp-cron.php?doing_wp_cron"
echo "================================================================="
