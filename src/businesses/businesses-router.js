const express = require('express')
const fetch = require('node-fetch')

const BusinessesRouter = express.Router()

BusinessesRouter
    .get('/', (req, res, next) => {
        let lat = req.query.lat
        let long = req.query.long
        
        fetch(`https://api.yelp.com/v3/businesses/search?term=food&latitude=${lat}&longitude=${long}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer X3oRfIMZfywOkzjRrgeCMUUN93rljhumD2Gtx0UBIeFvpvK3fK8XUYfEjjDsUg4rsCyFu2-QOl1NIFNFPEkok92cPwPH-KquWBb6T5Qk-q0N3M7TEXGI6D89J3vDXXYx",
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true 
            }
        })
        .then(res => res.json())
        .then(data => res.json(data))      
          
    })   

module.exports = BusinessesRouter
