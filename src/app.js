require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const BusinessesRouter = require('./businesses/businesses-router')
const UsersBusinessesRouter = require('./users_businesses/user-businesses-router')
const UsersRouter = require('./users/users-router')
const AuthRouter = require('./auth/auth-router')
const jsonBodyParser = express.json()

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
};

app.use(allowCrossDomain)
app.use(morgan(morganOption))
app.use(helmet())
app.use(jsonBodyParser)

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/login', AuthRouter)
app.use('/api/users',  UsersRouter)
app.use('/api/businesses', BusinessesRouter)
app.use('/api/users_businesses', UsersBusinessesRouter)

app.use(function errorHandler(error, req, res, next) {
   let response;
   if (NODE_ENV === 'production') {
     response = { error: 'server error' } 
   } else {
     console.error(error)
     response = error.message, error 
   }
   res.status(500).json(response)
})

module.exports = app