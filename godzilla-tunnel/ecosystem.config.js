module.exports = {
  apps: [
    {
      name: "cloudflare-tunnel",
      script: "cloudflared",
      args: "tunnel --no-autoupdate run <AQUI_TU_TUNNEL_ID>", // ⚠️ Reemplaza con tu Tunnel ID
      interpreter: "none",
      autorestart: true,
      max_memory_restart: "128M",
      watch: false,
      env: {
        TUNNEL_ORIGIN_ENABLE_HTTP2: "true"
      }
    },
    {
      name: "wp-health-monitor",
      script: "./health-check.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "64M",
      watch: false,
      env: {
        WP_URL: "http://localhost:80" // 🔥 Endpoint local de WP (Apache/Nginx) oculto del router
      }
    }
  ]
};
