const express = require("express");
const authMiddleware = require("./middleware");
const router = express.Router();
const Users = require("../data/users");
const UserDB = require("../models/User");
const config = require("../config.json");

router.get("/", authMiddleware, async (req, res) => {
  if (! req.hasBeenCookieAuthenticated) {
    res.redirect("/");
  } else {
    res.clearCookie(config.COOKIE.name);
    req.session.destroy();
    res.render("logout", {title: "Logged Out"})
  }
});

module.exports = router;
