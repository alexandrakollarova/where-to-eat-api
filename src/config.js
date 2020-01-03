module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    //DATABASE_URL: process.env.DATABASE_URL || 'postgres://xxsbmccdenndfp:a5aa2aee083d8b7c720ef9991f1fb9f4bf580a4e9a8d9a7dc065fda8aac7104f@ec2-107-21-201-238.compute-1.amazonaws.com:5432/d3vt7quujogoos',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/where_to_eat_db',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}