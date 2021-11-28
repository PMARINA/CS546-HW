const config = require("../config.json");

async function checkForAuth(req, res, next) {
  if (req.session && req.session.username) {
    req.hasBeenCookieAuthenticated = true;
  }
  next();
}

module.exports = checkForAuth;
