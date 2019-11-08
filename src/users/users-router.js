const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const UsersRouter = express.Router()
const jsonBodyParser = express.json()

UsersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { user_name, user_password} = req.body

    for (const field of ['user_name', 'user_password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // TODO: check user_name doesn't start with spaces

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('where_to_eat_db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              user_password: hashedPassword,
            }

            return UsersService.insertUser(
              req.app.get('where_to_eat_db'),
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