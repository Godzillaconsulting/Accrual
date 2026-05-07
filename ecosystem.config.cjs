module.exports = {
  apps: [
    {
      name: "accrual-bot",
      script: "./bot/whatsappBot.js",
      interpreter: "node",
      node_args: "--env-file=.env",
      autorestart: true,
      max_memory_restart: "256M",
      watch: false,
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "accrual-api",
      script: "./local-api.js",
      interpreter: "node",
      node_args: "--env-file=.env",
      autorestart: true,
      max_memory_restart: "256M",
      watch: false,
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "accrual-health-monitor",
      script: "./bot-health-check.js",
      instances: 1,
      autorestart: true,
      max_memory_restart: "64M",
      watch: false,
      env: {
        BOT_URL: "http://localhost:3005"
      }
    }
  ]
};
