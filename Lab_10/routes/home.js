const express = require("express");
const authMiddleware = require("./middleware");
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  if (req.hasBeenCookieAuthenticated) {
    res.redirect("/private");
  } else {
    res.render("login", { title: "Log In" });
  }
});

module.exports = router;
