const jwt = require("jsonwebtoken");
const secret = "some secret";
const { getJwtTokenFromCookie, UserModel } = require("../utils");

const setupAuth = (app, routes) => {
  routes
    .filter((route) => route.auth)
    .forEach((route) => {
      app.use(route.url, async (req, res, next) => {
        const jwtToken = getJwtTokenFromCookie(req);
        try {
          const decodedToken = await jwt.verify(jwtToken, secret);
          const requiredRoles = route.roles || [];
          if (requiredRoles.length > 0) {
            const user = await UserModel.findById(decodedToken._id);
            const { roles } = user;
            let isAuthorized = true;
            for (let i = 0; i < requiredRoles.length; i++) {
              if (!roles.includes(requiredRoles[i])) {
                isAuthorized = false;
                break;
              }
            }
            if (!isAuthorized) {
              throw new Error("Authorization required to perform this action");
            }
          }
          req.headers.userid = decodedToken._id;
          next();
        } catch (error) {
          next(error);
        }
      });
    });
};

module.exports = setupAuth;
