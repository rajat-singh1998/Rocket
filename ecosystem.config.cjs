module.exports = {
  apps: [
    {
      name: "rocket-backend",
      cwd: "/var/www/rocket/backend",
      script: "src/server.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: "5000"
      },
      max_memory_restart: "300M",
      out_file: "/var/log/rocket/backend-out.log",
      error_file: "/var/log/rocket/backend-error.log",
      time: true
    }
  ]
};
