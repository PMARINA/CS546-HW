restaurantRoutes = require('./restaurants');
reviewRoutes = require('./reviews');

const constructorMethod = (app) => {
  app.use('/restaurants', restaurantRoutes);
  app.use('/reviews', reviewRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: `${req.originalUrl} is not a valid route`});
  });
};

module.exports = constructorMethod;

