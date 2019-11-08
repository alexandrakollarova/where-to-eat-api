const express = require('express')
const request = require('request')
const UsersService = require('./users-service')

const businessesRouter = express.Router()

businessesRouter
    .route('/')
    .get((req, res, next) => {
        request({
            host: "api.yelp.com",
            uri: "https://api.yelp.com/v3/businesses/search?term=food&location=boston",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer X3oRfIMZfywOkzjRrgeCMUUN93rljhumD2Gtx0UBIeFvpvK3fK8XUYfEjjDsUg4rsCyFu2-QOl1NIFNFPEkok92cPwPH-KquWBb6T5Qk-q0N3M7TEXGI6D89J3vDXXYx"
            }
        },
        function(error, res, body) {
            if (!error) {
                console.log(body)
            } else {
                res.json(error)
            }
        })
    })

module.exports = businessesRouter
