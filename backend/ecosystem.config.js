module.exports = {
    apps: [
      {
        name: 'user-management-api',
        script: 'dist/main.js',
        instances: 2,
        exec_mode: 'cluster',
        max_memory_restart: '300M',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
};
