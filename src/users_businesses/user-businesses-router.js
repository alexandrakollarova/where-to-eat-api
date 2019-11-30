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
      let business = { business_id: businessId }

      UsersBusinessesService.hasBusinessWithSameId(
        req.app.get('db'),
        business
      )
        .then(isDuplicate => { console.log(isDuplicate)
          if (isDuplicate) {
            UsersBusinessesService.updateExistingBusiness(
              req.app.get('db'),
              business
            )
          } else {
            UsersBusinessesService.postBusiness(
              req.app.get('db'),
              //encodedUser.user_id,
              business
            )
              .then(business => {
                res.status(201)
              })
                .catch(next)
          }          
        })         
    })

module.exports = UsersBusinessesRouter