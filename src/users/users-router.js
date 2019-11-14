const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const UsersRouter = express.Router()

UsersRouter
  .post('/', (req, res, next) => {
    const user_name = req.body.user_name.value;
    const user_password = req.body.user_password.value;
    
    for (const field of ['user_name', 'user_password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const passwordError = UsersService.validatePassword(user_password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(user_password)
          .then(hashedPassword => { 
            const newUser = {
              user_name,
              user_password: hashedPassword,
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))                  
              })
              
          })
      })
      .catch(next)
  })

module.exports = UsersRouter