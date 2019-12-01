const express = require("express");
const BusinessService = require("./business-service");
const AuthService = require("../auth/auth-service");
const UsersBusinessesService = require("./user-businesses-service");

const UsersBusinessesRouter = express.Router();

UsersBusinessesRouter.route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    BusinessService.getAllUsersBusinesses(knexInstance)
      .then(businesses => {
        res.json(businesses.map(serializeNote));
      })
      .catch(next);
  })

  .post((req, res, next) => {
    const activeUser = req.body.userId;
    const businessId = req.body.businessId;

    if (businessId == null) {
      return res.status(400).json({
        error: { message: `Missing business id in request body` }
      });
    }

    if (activeUser == null) {
      return res.status(400).json({
        error: { message: `Missing active user id in request body` }
      });
    }

    let encodedUser = AuthService.verifyJwt(activeUser);
    let user = { user_id: encodedUser.user_id };
    let business = { business_id: businessId };

    BusinessService.hasBusinessWithSameId(req.app.get("db"), business)
      .then(isDuplicate => {
        if (isDuplicate) {
          BusinessService.updateExistingBusiness(req.app.get("db"), business);
        } else {
          BusinessService.postBusiness(req.app.get("db"), business);
        }
      })
      .then(() => {
        UsersBusinessesService.getBusinessId(req.app.get("db"), business).then(
          id => {
            UsersBusinessesService.storeBusinessWithUser(
              req.app.get("db"),
              // user,
              // { business_id: id }
              user.user_id,
              id
            );
          }
        );
      })

      .then(business => {
        res.status(201);
      })
      .catch(next);
  });

module.exports = UsersBusinessesRouter;
