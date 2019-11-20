require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL,
    //"ssl": !!process.env.SSL 
    "ssl": true
  // "host": 'ec2-107-21-201-238.compute-1.amazonaws.com',
  // "port": 5432,
  // "database": 'd3vt7quujogoos',
  // "username": 'xxsbmccdenndfp',
  // "password": 'a5aa2aee083d8b7c720ef9991f1fb9f4bf580a4e9a8d9a7dc065fda8aac7104f',
  // "ssl": true,
  //"connectionString": process.env.NODE_ENV === 'test' && process.env.TEST_DB_URL
}