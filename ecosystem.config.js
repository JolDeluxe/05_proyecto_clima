module.exports = {
  apps: [
    {
      name: "gptw-mbc",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "./",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        DATABASE_URL: "file:./dev.db",
        JWT_SECRET: "super_secreto_clave_mbc_2026_cuadra",
        IMAGES_BASE_PATH: "C:\\Servidor\\Datos\\Clima",
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      time: true,
    },
  ],
};
