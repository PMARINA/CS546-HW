
/**
 * Check if a parameter is a non-empty string
 * @param {string} s The parameter to check
 */
function checkString(s) {
  if (typeof(s)!== 'string' || s.trim().length === 0) {
    throw Error('Bad input, expected a non empty string');
  }
}

module.exports = {checkString};
