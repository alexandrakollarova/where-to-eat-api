require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
  "ssl": true,
  "ssl": !!process.env.SSL,
  "host": 'ec2-107-21-201-238.compute-1.amazonaws.com',
  "port": 5432,
  "database": 'd3vt7quujogoos',
}