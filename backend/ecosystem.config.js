module.exports = {
  apps: [
      {
          name: 'NewsParserBackend',
          cwd: '/home/newsparser/backend/',
          script: 'npm',
          args: 'start',
          env: {
              NODE_ENV: 'production',
          },
      },
  ],
};
