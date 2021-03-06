const mdb = require('mongodb');
// const ServerSideError = require('./errors').ServerSideError;
const ClientSideError = require('./errors').ClientSideError;
// const ResourceNotFoundError = require('./errors').ResourceNotFoundError;

const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/(\d{4})$/;
/**
 * Verify that the type of a variable is the expected type(s)
 * @param {string} parameterName The name of the parameter
 * @param {Any} val The parameter to check
 * @param {(string | [string])} acceptedTypes The list or single accepted type
 */
function checkType(parameterName, val, acceptedTypes) {
  if (typeof (acceptedTypes) != 'object') acceptedTypes = [acceptedTypes];
  if (!acceptedTypes.includes(typeof (val))) {
    throw new ClientSideError(`${parameterName} was of the incorrect type: ` +
            `${typeof (val)}. Expected ${acceptedTypes}`);
  }
}

/**
 * Error if the parameter is empty spaces (or is an empty string)
 * @param {string} parameterName The name of the parameter
 * @param {string} val The parameter to validate
 */
function checkNotEmptySpaces(parameterName, val) {
  if (val.trim().length === 0) {
    throw new ClientSideError(`${parameterName} was empty or just spaces.`);
  }
}

/**
 * Ensure that the name:
 * - exists
 * - is a string
 * - is not empty
 * @param {string} name The name to validate
 */
function validateName(name) {
  checkType('Name', name, 'string');
  checkNotEmptySpaces('Name', name);
}

/**
 * Ensure that the location:
 * - exists
 * - is a string
 * - is not empty
 * @param {string} loc The location to validate
 */
function validateLocation(loc) {
  checkType('Location', loc, 'string');
  checkNotEmptySpaces('Location', loc);
  if (!loc.match(/.+, .+/)) {
    throw new ClientSideError(
        'Location does not follow the required format: city, area.',
    );
  }
}

/**
 * Ensure that the phone number:
 * - exists
 * - is a string
 * - is not empty
 * - matches the pattern: xxx-xxx-xxxx
 * @param {string} pn The phone number to validate
 */
function validatePhoneNumber(pn) {
  checkType('Phone Number', pn, 'string');
  if (!pn.match(/^\d{3}-\d{3}-\d{4}$/)) {
    throw new ClientSideError(
        'Phone number was not of the correct format.',
    );
  }
}

/**
 * Ensure that the website:
 * - exists
 * - is a string
 * - is not empty
 * - matches the pattern: http://www._____.com
 * @param {string} addr The webiste's address to validate
 */
function validateWebsite(addr) {
  checkType('Website', addr, 'string');
  if (!addr.match(/^http(s)?:\/{2}www\.[^ ]{5,}\.com$/)) {
    throw new ClientSideError('Website was not valid.');
  }
}

/**
 * Ensure that the price range:
 * - is a string
 * - exists
 * - is not empty
 * - is $, $$, $$$, $$$$
 * @param {string} pr The price range to validate
 */
function validatePriceRange(pr) {
  checkType('Price Range', pr, 'string');
  if (!pr.match(/^\${1,4}$/)) {
    throw new ClientSideError(`Invalid price range: ${pr}.` +
            ' Expected one of $, $$, $$$, $$$$.');
  }
}

/**
 * Ensure that cuisines:
 * - is an array
 * - contains only strings
 * - all the strings are valid
 * @param {[string]} cuisines The cuisines to validate
 */
function validateCuisines(cuisines) {
  checkType('Cuisines', cuisines, 'object');
  if (cuisines === null) throw new ClientSideError('Cuisines cannot be null.');
  if (!Array.isArray(cuisines)) {
    throw new ClientSideError('Cuisines was not an array.');
  }
  if (cuisines.length <= 0) {
    throw new ClientSideError('Expected length of Cuisines > 1.');
  }
  const parameterName = 'Item of cuisines';
  cuisines.forEach((item) => {
    checkType(parameterName, item, 'string');
    checkNotEmptySpaces(parameterName, item);
  });
}

/**
 * Validate that rating is a number 0-5
 * @param {number} rating A number between 0, 5 inclusive
 */
function validateOverallRating(rating) {
  checkType('Overall Rating', rating, 'number');
  if (!(0 <= rating && rating <= 5)) {
    throw new ClientSideError('Overall rating expected to be ' +
            'between 0 and 5 (inc). ' + `Received ${rating}.`);
  }
}

/**
 * Validate that service options:
 * - Is an object
 * - Contains the correct keys
 * -
 * @param {object} servOpt Object of string-bool relationships
 */
function validateServiceOptions(servOpt) {
  checkType('Service Options', servOpt, 'object');
  if (servOpt === null || Array.isArray(servOpt)) {
    throw new ClientSideError(
        'Expected service options to be a non-null non-array.',
    );
  }
  if (Object.keys(servOpt).length != 3) {
    throw new ClientSideError(
        'Expected 3 keys in service options.',
    );
  }
  // This works because obj[random key] yields undefined...
  checkType('Service Options - dine in', servOpt['dineIn'], 'boolean');
  checkType('Service Options - takeout', servOpt['takeOut'], 'boolean');
  checkType('Service Options - delivery', servOpt['delivery'], 'boolean');
}

/**
 * Validate that the id is a valid string for MongoDB
 * @param {string} id A mongodb id
 */
function validateId(id) {
  checkType('id', id, 'string');
  checkNotEmptySpaces('id', id);
  // The following line will throw if not a valid object ID.
  try {
    new mdb.ObjectId(id);
  } catch (e) {
    throw new ClientSideError(
        'Invalid MongoDB.ObjectId received. ' +
        `Please double check your input (${id})`,
    );
  }
  //   throw Error('Not implemented');
  // Check if the id is in the database
  // (perhaps this should be part of the actual method?)
}
/**
 * Trim the primitive passed in if possible.
 * If not, return the original value.
 * @param {*} v A variable passed into a function
 * @return {*} The trimmed version of the variable, if possible.
 */
function tryTrim(v) {
  try {
    v = v.trim();
  } catch (e) {}
  return v;
}

/**
 * Validate if a date is in the expected format.
 * @param {string} date A date in MM/DD/YYYY Format
 */
function validateDate(date) {
  checkType('Date', date, 'string');
  if (! date.match(dateRegex)) {
    throw new ClientSideError(`Date (${date}) is not in the correct format` +
    ' (MM/DD/YYYY) or is implausible.');
  };
}

/**
 * Validate if the date provided falls within the current date.
 * Note that this does not consider timezones and potential issues
 * with 12h/other timezone offsets that could mess with dates
 * syncing between server/client
 *
 * @param {string} date The date specified
 */
function validateDateIsToday(date) {
  validateDate(date);
  const today = new Date();

  const matchArr = date.match(dateRegex);

  // Javascript dates are stupid
  // https://stackoverflow.com/q/15799514
  const inputMonth = parseInt(matchArr[1]) - 1;
  const inputDay = matchArr[2];
  const inputYear = matchArr[3];

  const inputDate =
  new Date(year=inputYear, monthIndex = inputMonth, date=inputDay);

  if (inputDate.getFullYear() !== today.getFullYear() ||
        inputDate.getMonth() !== today.getMonth() ||
          inputDate.getDate() !== today.getDate()) {
    throw new ClientSideError(
        'The date provided was not the same as today\'s date. ' +
        'Please double check your system time and report '+
        'this issue to the server administrator.',
    );
  }
}

module.exports = {
  checkType,
  checkNotEmptySpaces,
  validateName,
  validateLocation,
  validatePhoneNumber,
  validateWebsite,
  validatePriceRange,
  validateCuisines,
  validateOverallRating,
  validateServiceOptions,
  validateId,
  tryTrim,
  validateDate,
  validateDateIsToday,
};
