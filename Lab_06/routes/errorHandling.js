/**
 * If an error happens when handling a route, return the correct HTTP status
 * @param {Error} e The error object being handled (must have caught it)
 * @param {Object} res The response object to coordinate the error code with
 */
function handleError(e, res) {
  statusCode = 0;
  if (e.name && e.name == 'ServerSideError') {
    statusCode = 500;
  } else if (e.name && e.name == 'ClientSideError') {
    statusCode = 400;
  } else if (e.name && e.name == 'ResourceNotFoundError') {
    statusCode = 404;
  } else {
    // There is an error somewhere that hasn't
    // been correlated to an http error code
    statusCode = 501;
  }
  res.status(statusCode).json({error: e.message,
    traceback: e.stack});
}

module.exports = handleError;
