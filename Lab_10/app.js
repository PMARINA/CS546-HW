const express = require("express");
const app = express();
const session = require("express-session");
const configRoutes = require("./routes");
const config = require("./config.json");
const bs = require("express-handlebars");
const mongoose = require('mongoose');
// app.engine("handlebars", bs({ defaultLayout: "homePage" }));
app.engine("handlebars", bs({ defaultLayout: "homePage" }));
app.set("view engine", "handlebars");

// app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: config.COOKIE.name,
    secret: config.COOKIE.secret,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 },
  })
);
mongoose.connect(`mongodb://127.0.0.1:27017/${config.DATABASE.name}`);
configRoutes(app);

app.listen(3000, () => {
  console.log("Server live @ http://localhost:3000");
});
