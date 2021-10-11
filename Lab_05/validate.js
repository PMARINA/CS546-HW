/**
 *
 * @param {string} id The id to validate
 */
function validateId(id) {
  if (typeof id !== 'string') {
    throw Error('id expected to be a string');
  }
  if (id.trim().length === 0) {
    throw Error('id expected to be nonempty');
  }
}

module.exports = {
  validateId,
};
