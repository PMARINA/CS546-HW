// const postRoutes = require('./posts');
// const userRoutes = require('./users');
const homePage = require('./home');
const search = require('./search');
// const path = require('path');

const constructorMethod = (app) => {
  app.use('/', homePage);
  app.use('/search', search);
  //   app.use('/posts', postRoutes);
  //   app.use('/users', userRoutes);
  //   app.get('/about', (req, res) => {
  //     res.sendFile(path.resolve('static/about.html'));
  //   });

  //   app.use('*', (req, res) => {
  //     res.redirect('/posts');
  //   });
};

module.exports = constructorMethod;
