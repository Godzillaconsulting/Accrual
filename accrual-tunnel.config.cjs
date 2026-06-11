module.exports = {
  apps: [
    {
      name: "accrual-cloudflare-tunnel",
      script: "C:\\Program Files (x86)\\cloudflared\\cloudflared.exe",
      args: "tunnel --no-autoupdate run --protocol http2 --token eyJhIjoiODk5YmJiOGZhYjBhZGMwYThlNzlkM2Q4NjhhZmU4NmEiLCJ0IjoiOThlYzJmMTAtM2M4NS00N2NiLWI2ZDMtZjlmNmExZTc4ODk0IiwicyI6Ill6Rm1OR1ZqWkdJdFpHSTBPUzAwT0dZNExXRmlOVFV0TXpJek16QTRPV1l3TTJFdyJ9",
      interpreter: "none",
      autorestart: true,
      max_memory_restart: "128M",
      watch: false,
      env: {
        TUNNEL_ORIGIN_ENABLE_HTTP2: "true"
      }
    }
  ]
};
