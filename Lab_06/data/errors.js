/**
 *
 * @param {string} message The message to throw when throwing the error
 */
function ServerSideError(message = '') {
  this.name = 'ServerSideError';
  this.message = message;
}

/**
 *
 * @param {string} message The message to throw when throwing the error
 */
function ClientSideError(message = '') {
  this.name = 'ClientSideError';
  this.message = message;
}

/**
 *
 * @param {string} message The message to throw when throwing the error
 */
function ResourceNotFoundError(message = '') {
  this.name = 'ResourceNotFoundError';
  this.message = message;
}

ServerSideError.prototype = Error.prototype;
ClientSideError.prototype = Error.prototype;
ResourceNotFoundError.prototype = Error.prototype;

module.exports = {
  ServerSideError, ClientSideError, ResourceNotFoundError,
};
