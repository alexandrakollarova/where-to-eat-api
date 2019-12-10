const express = require("express");
const BusinessService = require("./business-service");
const AuthService = require("../auth/auth-service");
const UsersBusinessesService = require("./user-businesses-service");
const fetch = require('node-fetch');

const UsersBusinessesRouter = express.Router();

UsersBusinessesRouter.route("/")
  .get((req, res, next) => {
    const activeUser = req.query.user;

    let encodedUser = AuthService.verifyJwt(activeUser);
    let user = { user_id: encodedUser.user_id };

    UsersBusinessesService.getUsersBusinessesId(
      req.app.get("db"),
      user.user_id
    )
      .then(async businesses => {
        console.log(businesses)
        // const requests = businesses.map(business => {
        // return fetch(`https://api.yelp.com/v3/businesses/${business.business_id}`,
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //       "Authorization": "Bearer X3oRfIMZfywOkzjRrgeCMUUN93rljhumD2Gtx0UBIeFvpvK3fK8XUYfEjjDsUg4rsCyFu2-QOl1NIFNFPEkok92cPwPH-KquWBb6T5Qk-q0N3M7TEXGI6D89J3vDXXYx",
        //       "Access-Control-Allow-Origin": "*",
        //       "Access-Control-Allow-Credentials": true
        //     }
        //   });
        // });
        //Promise.all(requests).then(data => res.json(data))
        // Promise.all(requests)
        //   .then(responses => {
        //   const toJson = responses.map(response => response.json());
        //     Promise.all(toJson).then(data => console.log(data));
        //   })
        const data = [];

        for (const { business_id } of businesses) {
          const fromYelp = await fetch(`https://api.yelp.com/v3/businesses/${business_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer X3oRfIMZfywOkzjRrgeCMUUN93rljhumD2Gtx0UBIeFvpvK3fK8XUYfEjjDsUg4rsCyFu2-QOl1NIFNFPEkok92cPwPH-KquWBb6T5Qk-q0N3M7TEXGI6D89J3vDXXYx",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
              }
            }
          );
          const jsonData = await fromYelp.json();
          data.push(jsonData);
        }
        console.log(data)
        res.json(data);
      })
  })

  .post((req, res, next) => {
    const activeUser = req.body.userId;
    const businessId = req.body.businessId;

    for (const field of ["userId", "businessId"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    let encodedUser = AuthService.verifyJwt(activeUser);
    let user = { user_id: encodedUser.user_id };
    let business = { business_id: businessId };

    BusinessService.checkForDuplicates(req.app.get("db"), business)
      .then(isDuplicate => {
        if (isDuplicate) {
          return BusinessService.updateExistingBusiness(req.app.get("db"), business);
        } else {
          return BusinessService.saveBusiness(req.app.get("db"), business);
        }
      })
      .then(() => {
        UsersBusinessesService.getBusinessId(req.app.get("db"), business).then(
          data => {
            let id = data.id
            console.log(id)
            UsersBusinessesService.saveBusinessWithUser(
              req.app.get("db"),
              user.user_id,
              id
            )
              .then(business => {
                console.log("BUSINESS SAVED AS", business)
                res.sendStatus(200)
              })
              .catch(next);
          }
        );
      })
  })

  .delete((req, res, next) => {
    const activeUser = req.body.userId;
    const businessId = req.body.businessId;

    for (const field of ["userId", "businessId"])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    let encodedUser = AuthService.verifyJwt(activeUser);
    let user = { user_id: encodedUser.user_id };
    let business = { business_id: businessId };

    UsersBusinessesService.getBusinessId(req.app.get("db"), business).then(
      data => {
        let id = data.id

        UsersBusinessesService.deleteBusinessFromUser(
          req.app.get("db"),
          id
        )
          .then(business => {
            console.log("NUMBER OF DELETED ROWS", business)
            res.sendStatus(200)
          })
          .catch(next);
      });

  })




module.exports = UsersBusinessesRouter;
