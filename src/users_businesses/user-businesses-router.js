const express = require("express");
const BusinessService = require("./business-service");
const AuthService = require("../auth/auth-service");
const UsersBusinessesService = require("./user-businesses-service");

const UsersBusinessesRouter = express.Router();

UsersBusinessesRouter.route("/")
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
                res.status(200)
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
            res.status(200)
          })
            .catch(next);
          });

    })


   

module.exports = UsersBusinessesRouter;
