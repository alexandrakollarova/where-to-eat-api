const express = require('express')
const UsersBusinessesService = require('./users-businesses-service')
const AuthService = require('../auth/auth-service')

const UsersBusinessesRouter = express.Router()

UsersBusinessesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersBusinessesService.getAllUsersBusinesses(knexInstance)
      .then(businesses => {     
        res.json(businesses.map(serializeNote))
      })
        .catch(next)
    })

    .post((req, res, next) => {
      const activeUser = req.body.userId
      const businessId = req.body.businessId

      if (businessId == null) {
        return res.status(400).json({
          error: { message: `Missing business id in request body` }
          })
      }  

      if (activeUser == null) {
        return res.status(400).json({
          error: { message: `Missing active user id in request body` }
          })
      }  

      let encodedUser = AuthService.verifyJwt(activeUser)

      UsersBusinessesService.postBusiness(
        req.app.get('db'),
        encodedUser.user_id,
        parseInt(businessId)
      )
        .then(business => {
          res.status(201)
        })
          .catch(next)
    })

module.exports = UsersBusinessesRouter