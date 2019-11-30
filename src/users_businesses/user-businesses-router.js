const express = require('express')
const UsersBusinessesService = require('./users-businesses-service')

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
        const newBusiness = req.body.businessId
       console.log(req.session)
        if (newBusiness == null) {
          return res.status(400).json({
            error: { message: `Missing businessId in request body` }
          })
        }           
    
        UsersBusinessesService.postBusiness(
          req.app.get('db'),
          activeUser,
          newBusiness
        )
          .then(business => {
            res
              .status(201)
          })
          .catch(next)
      })

module.exports = UsersBusinessesRouter