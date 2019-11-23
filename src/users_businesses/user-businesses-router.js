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
        const businessId = req.body.businessId
        const newBusiness = businessId
   
        if (newBusiness == null) {
          return res.status(400).json({
            error: { message: `Missing businessId in request body` }
          })
        }           
    
        UsersBusinessesService.postBusiness(
          req.app.get('db'),
          newBusiness
        )
          .then(business => {
            res
              .status(201)
          })
          .catch(next)
      })

module.exports = UsersBusinessesRouter