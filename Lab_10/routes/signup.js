const express = require("express");
const authMiddleware = require("./middleware");
const router = express.Router();
const Users = require("../data/users");
const UserDB = require("../models/User");

router.get("/", authMiddleware, async (req, res) => {
  if (req.hasBeenCookieAuthenticated) {
    res.redirect("/private");
  } else {
    res.render("signup", { title: "Sign Up" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  if (req.hasBeenCookieAuthenticated) {
    res.redirect("/private");
  } else {
    if (! req.body){
      req.body = {};
    }
    uname = req.body.username;
    pd = req.body.password;
    let unameHelp = undefined;
    let pwdHelp = undefined;
    let genHelp = undefined;
    let statusCode = -1;
    if (typeof uname !== "string" || uname.length === 0) {
      unameHelp = "Username is missing or not a string";
    }
    if (!unameHelp) uname = uname.trim();
    if (!unameHelp && uname.length < 4) {
      unameHelp =
        "Username must be at least 4 characters long and not contain spaces";
    }
    if (!unameHelp) {
      const charCodeOfA = "A".charCodeAt(0);
      const charCodeOfZ = "Z".charCodeAt(0);
      const charCodeOfa = "a".charCodeAt(0);
      const charCodeOfz = "z".charCodeAt(0);
      const charCodeOf0 = "0".charCodeAt(0);
      const charCodeOf9 = "9".charCodeAt(0);
      for (let i = 0; i < uname.length; i++) {
        const c = uname.charCodeAt(i);
        if (c >= charCodeOfA && c <= charCodeOfZ) continue;
        if (c >= charCodeOfa && c <= charCodeOfz) continue;
        if (c >= charCodeOf0 && c <= charCodeOf9) continue;
        unameHelp =
          "Username must only contain alphanumeric characters (no spaces/etc)";
      }
    }
    if (typeof pd !== "string" || pd.length === 0)
      pwdHelp = "Password is missing or blank";
    if (!pwdHelp && pd.includes(" "))
      pwdHelp = "Password may not contain spaces";
    if (!pwdHelp && pd.length < 6)
      pwdHelp = "Password must be at least 6 characters long";
    if (!pwdHelp && !unameHelp && !genHelp) {
      let result = undefined;
      try {
        if (!unameHelp && (await UserDB.exists({ username: uname }))) {
          unameHelp =
            "Username taken. Please sign in or pick another username.";
        }
        if (!unameHelp) {
          result = await Users.createUser(uname, pd);
          if (!result || !result.userInserted) {
            genHelp = "Internal Server Error";
          }
          statusCode = 500;
        }
      } catch (e) {
        genHelp = `Error from DB: ${e.message}`;
        if (genHelp.includes("10000ms")){
            statusCode = 500;
            genHelp = "Database timed out. Check connection from server to db."
        }
      }
    }
    if (unameHelp || pwdHelp || genHelp) {
      if (statusCode === -1) {
        statusCode = 400;
      }
      res
        .status(statusCode)
        .render("signup", {
          title: "Sign Up",
          uname,
          genHelp,
          unameHelp,
          pwdHelp,
        });
    } else {
      res.redirect("/");
    }
  }
});

module.exports = router;
