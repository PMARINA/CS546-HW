// const postRoutes = require('./posts');
// const userRoutes = require('./users');
const homePage = require('./home');
const search = require('./search');
const character = require('./character');
const notfound = require('./notfound');
// const path = require('path');

const constructorMethod = (app) => {
  app.use('/', homePage);
  app.use('/search', search);
  app.use('/characters', character);
  app.use('*', notfound);
};

module.exports = constructorMethod;
