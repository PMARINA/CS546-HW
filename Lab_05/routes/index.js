peopleRoutes = require('./people');
stocksRoutes = require('./stocks');

const constructorMethod = (app) => {
  app.use('/people', peopleRoutes);
  app.use('/stocks', stocksRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: `${req.originalUrl} is not a valid route`});
  });
};

module.exports = constructorMethod;

