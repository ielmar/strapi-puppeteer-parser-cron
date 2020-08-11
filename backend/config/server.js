module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  proxy: {
    enabled: false
  },
  cron: {
    enabled: true
  },
  admin: {
    autoOpen: false,
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  }
});
