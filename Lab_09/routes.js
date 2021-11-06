/**
 * Set up the routes for the app
 * @param {object} app The express app created by calling express()
 */
function constructorMethod(app) {
  app.get('/', index);
  app.use('*', notFound);
}

/**
 * Return the home page
 * @param {object} _ req
 * @param {object} res The response callback?
 */
async function index(_, res) {
  res.sendFile('index.html', {root: __dirname + '/html/'});
  return;
}

/**
 * Return the error page
 * @param {*} _ req
 * @param {*} res The response object
 */
async function notFound(_, res) {
  res.status(404).sendFile('error.html', {root: __dirname + '/html/'});
  return;
}

module.exports = constructorMethod;
