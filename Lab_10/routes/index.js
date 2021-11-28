const home = require("./home");
const signup = require("./signup");
const login = require('./login');
const private = require('./private');
const logout = require('./logout');
const constructorMethod = (app) => {
  //app.uses go here
  app.use("/", home);
  app.use("/signup", signup);
  app.use('/login', login);
  app.use('/private', private);
  app.use('/logout', logout);
  app.all('*', (req, res)=>{
    res.status(404).render('error', {title: "Error", errCode: 404, shortErrMsg: "Res. Not Found", errMsg: `The requested resource (${req.originalUrl}) was not found on this site`})
  })
};

module.exports = constructorMethod;
