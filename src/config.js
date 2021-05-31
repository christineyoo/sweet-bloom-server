module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://chris@localhost/sweetbloom',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    'postgresql://chris@localhost/sweetbloom-test',
  CLIENT_ORIGIN: {
    origin: 'http://localhost:3000',
    methods: 'GET'
  }
};
