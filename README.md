# where-to-eat API

## Description

### API endpoints

`app.use('/api/login', AuthRouter)` accept POST request, handles user secure login, expects username and password, sends back encrytped credentials that is then stored in local storage in browser  
`app.use('/api/users',  UsersRouter)` accepts POST request, handles user registration, expects username and password, sends back encrytped credentials that is then stored in local storage in browser  
`app.use('/api/businesses', BusinessesRouter)` accepts GET request, handles fetching restaurants from Yelp API, expects browser's latitude and longitude that is used to fetch the restaurants in your location  
`app.use('/api/users_businesses', UsersBusinessesRouter)` accepts GET, POST, DELETE requests, handles the relation between users and saved restaurants under their account, expects encrytped user id

## Create and set up database using Postgres

1. install psql -- PostgreSQL interactive terminal <https://www.postgresql.org/download/>

2. open terminal and run `pg_ctl start`

3. run `psql` to run psql shell

4. create user `CREATE USER [your-username] WITH option [option-you-want];` -- make sure to use an option that allows to create a database
   (for more info see the docs <https://www.postgresql.org/docs/current/sql-createuser.html>)

5. create database `CREATE DATABASE where_to_eat_db WITH OWNER [your-username];`  
   (for more info see the docs <https://www.postgresql.org/docs/current/sql-createdatabase.html>)

6. move to where_to_eat_db database `\c where_to_eat_db`

7. create tables  
   `CREATE TABLE users (  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,  user_name TEXT NOT NULL,  user_password TEXT NOT NULL);`  
   `CREATE TABLE business (  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,  business_id TEXT NOT NULL);`  
   `CREATE TABLE user_businesses (  user_id INTEGER REFERENCES users(id) NOT NULL,  business_id INTEGER REFERENCES business(id) NOT NULL,  PRIMARY KEY (user_id, business_id));`

8. OPTIONAL: seed the table `users` with demo credentials  

   `INSERT INTO users (user_name, user_password)`  
       `VALUES`  
           `('demo_user', '$2a$04$HNAwLgr8vBhbKfbHUKRane/eBWJ5WLzT12WmANApEAex7W.d91jhG');`  
   Note: the password for demo_user is already hashed, you can login with user name `demo_user` and password `demo_password`


## Set up the server

1. `cd` into the desired directory

2. clone this repository `git clone https://github.com/alexandrakollarova/where-to-eat-api`

3. `cd` into the cloned repository

4. install node dependencies `npm install`

5. open config.js file and comment out the remote database deployed on Heroku  
   `/DATABASE_URL: process.env.DATABASE_URL || 'postgres://xxsbmccdenndfp:a5aa2aee083d8b7c720ef9991f1fb9f4bf580a4e9a8d9a7dc065fda8aac7104f@ec2-107-21-201-238.compute-1.amazonaws.com:5432/d3vt7quujogoos'`  
   and uncomment  
   `DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/where_to_eat_db'`
   to use the database you created and run on your local machine

6. start the server `npm start` or start use nodemon for the app `npm run dev`

7. run tests `npm test`
