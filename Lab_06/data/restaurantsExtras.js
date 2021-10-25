const getCollection = require('../config/mongoCollections').restaurants;
const mdb = require('mongodb');
/**
 * Get restaurants from the database.
 * @param {[string]} id The id if not all
 * @param {boolean} allRestaurants Whether or not to fetch all rest.
 * @param {boolean} allData Whether to omit data beyond id, name
 * @return {object} Array of objects or object, depending on args
 */
async function getAndProcess(id, allRestaurants, allData) {
  const collection = await getCollection();
  const stringifyIds = allData ? {
    $addFields: {
      '_id': {
        '$convert': {
          input: '$$CURRENT._id',
          to: 'string',
        },
      },
      'reviews': {
        '$map': {
          'input': '$reviews', // Get only unique ids from the array
          'as': 'rev',
          'in': {
            $setField: {
              'field': '_id',
              'input': '$$rev',
              'value': {
                '$convert': {
                  input: '$$rev._id',
                  to: 'string',
                },
              },
            },
          },
        },
      },
    },
  } :
  {
    $addFields: {
      '_id': {
        '$convert': {
          input: '$$CURRENT._id',
          to: 'string',
        },
      },
    },
  };
  const pipeline = [];

  if (! allRestaurants) {
    pipeline.push({'$match': {'_id': new mdb.ObjectId(id)}});
  }

  if (! allData) {
    pipeline.push({'$project': {
      'name': 1,
      '_id': 1,
    }});
  }
  pipeline.push(stringifyIds);
  //   console.log('Pipeline: ' + JSON.stringify(pipeline));
  res = await collection.aggregate(pipeline);
  res = res.toArray();
  //   console.log('Result: ' + JSON.stringify(res, spacer='  '));
  return res;
}

/**
 *
 * @param {string} name The name of the restaurant
 * @param {string} location The location of the restaurant
 * @param {string} phoneNumber The phone number of the restaurant: xxx-xxx-xxxx
 * @param {string} website The website of the restaurant: http://www._____.com
 * @param {string} priceRange The price range of the restaurant: $-$$$$
 * @param {[string]} cuisines The cuisines offered at the restaurant
 * @param {object} serviceOptions The service options: delivery, takeout, etc
 * @return {object} An object with all those parameters
 */
function trimAndValidate(name, location, phoneNumber, website,
    priceRange, cuisines, serviceOptions) {
  name = tryTrim(name);
  location = tryTrim(location);
  phoneNumber = tryTrim(phoneNumber);
  website = tryTrim(website);
  priceRange = tryTrim(priceRange);
  try {
    newCuisines = [];
    cuisines.forEach((element) =>
      newCuisines.push(tryTrim(element)),
    );
    cuisines = newCuisines;
  } catch (e) { }

  validateName(name);
  validateLocation(location);
  validatePhoneNumber(phoneNumber);
  validateWebsite(website);
  validatePriceRange(priceRange);
  validateCuisines(cuisines);
  validateServiceOptions(serviceOptions);
  return {
    'name': name,
    'location': location,
    'phoneNumber': phoneNumber,
    'website': website,
    'priceRange': priceRange,
    'cuisines': cuisines,
    'serviceOptions': serviceOptions,
  };
}
module.exports = {
  getAndProcess,
  trimAndValidate,
};
