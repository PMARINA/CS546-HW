const express = require("express");
const authMiddleware = require("./middleware");
const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
    if (! req.hasBeenCookieAuthenticated)
        res.status(403).render("error", { title: "Error", errCode: 403, shortErrMsg: "Forbidden", errMsg: "You are not allowed to see this page."});
    else next();
})

router.get("/", async (req, res) => {
  if (! req.hasBeenCookieAuthenticated) {
    res.redirect("/");
  } else {
    res.render("private", { title: "Private", username: req.session.username });
  }
});

module.exports = router;
