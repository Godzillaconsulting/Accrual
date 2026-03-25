module.exports = {
  apps: [
    {
      name: 'accrual-bot',
      script: './bot/index.js',
      env: {
        NODE_ENV: 'production',
      },
      // Windows specific settings to avoid crashes
      exec_mode: 'fork',
      watch: false,
    }
  ]
};
