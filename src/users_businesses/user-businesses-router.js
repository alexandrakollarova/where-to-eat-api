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
          BusinessService.updateExistingBusiness(req.app.get("db"), business);
        } else {
          BusinessService.saveBusiness(req.app.get("db"), business);
        }
      })
      .then(() => {
        UsersBusinessesService.getBusinessId(req.app.get("db"), business).then(
          id => {console.log(id)
            UsersBusinessesService.saveBusinessWithUser(
              req.app.get("db"),
              user.user_id,
              id
            )
              .then(business => {
                console.log("RESULT", business)
                res.status(200)
              })
              .catch(err => console.log("ERROR STORING BUSINESS", err));
                // .catch(next);
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

    UsersBusinessesService.deleteBusinessFromUser(req.app.get("db"), user, business)

      .then(business => {
        console.log("NUMBER OF DELETED ROWS", business)
        res.status(200)
      })
      .catch(err => console.log("ERROR DELETING BUSINESS", err));
        // .catch(next);
    });

module.exports = UsersBusinessesRouter;
