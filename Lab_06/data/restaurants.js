// const dbConnection = require('./mongoConnection');
const getCollection = require('./config/mongoCollections').restaurants;
const mdb = require('mongodb');
({
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
} = require('./validate'));

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

/**
 *
 * @param {string} name The name of the restaurant
 * @param {string} location The location of the restaurant
 * @param {string} phoneNumber The phone number of the restaurant: xxx-xxx-xxxx
 * @param {string} website The website of the restaurant: http://www._____.com
 * @param {string} priceRange The price range of the restaurant: $-$$$$
 * @param {[string]} cuisines The cuisines offered at the restaurant
 * @param {object} serviceOptions The service options: delivery, takeout, etc
 * @return {object} The inserted object
 */
async function create(name, location, phoneNumber, website,
    priceRange, cuisines, serviceOptions) {
  ({
    name, location, phoneNumber, website,
    priceRange, cuisines, serviceOptions,
  } =
    trimAndValidate(name, location, phoneNumber,
        website, priceRange, cuisines, serviceOptions));
  const collection = await getCollection();
  const objToInsert = {
    'name': name,
    'location': location,
    'phoneNumber': phoneNumber,
    'website': website,
    'priceRange': priceRange,
    'cuisines': cuisines,
    'overallRating': 0,
    'serviceOptions': serviceOptions,
    'reviews': [],
  };

  const inserted = await collection.insertOne(objToInsert);

  if (!inserted.acknowledged) {
    throw Error('Something went wrong during insertion');
  }
  // Assign id first so it gets to the top of the keys
  const insertedId = inserted.insertedId.toString();
  const objToReturn = {'_id': insertedId};

  // Combine the two objects, which messes up the id key
  Object.assign(objToReturn, objToInsert);

  // Reassign the id key
  objToReturn._id = insertedId;

  return objToReturn;
}

/**
 * Return all restaurants in the database
 * @return {object[]}
 */
async function getAll() {
  const arrWithObjectIds = getAndProcess(null, true);
  return arrWithObjectIds;
}

/**
 * Get restaurants from the database.
 * @param {[string]} id The id if not all
 * @param {boolean} all Whether or not to fetch all restaurantsCollection
 * @return {object} Array of objects or object, depending on args
 */
async function getAndProcess(id, all) {
  const collection = await getCollection();
  const stringifyIds = {
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
  };
  const pipeline = all? [stringifyIds] : [
    {'$match': {'_id': new mdb.ObjectId(id)}},
    stringifyIds];
  res = await collection.aggregate(pipeline);
  return res;
}

/**
 * Find and return the restaurant from the db
 * @param {string} id The id of the object to retrieve
 * @return {object} The requested restaurant
 */
async function get(id) {
  id = tryTrim(id);
  validateId(id);
  const res = getAndProcess(id, false);
  if (!res) throw Error('Unable to find result for specified id');
  foundRestaurant._id = foundRestaurant._id.toString();
  return foundRestaurant;
}

/**
 * Delete a restaurant given its id
 * @param {string} id The id of the restaurant to delete
 * @return {string} A status message if deleted successfully
 */
async function remove(id) {
  id = tryTrim(id);
  validateId(id);
  const collection = await getCollection();

  const restaurantObj = await get(id);
  const restaurantName = restaurantObj.name;

  const result =
    await collection.deleteOne({'_id': new mdb.ObjectId(id)});

  if (result.deletedCount === 1) {
    return `${restaurantName} has been successfully deleted!`;
  }
  throw Error(`Unable to remove object with id: ${id}.` +
    ' Have you confirmed that it exists?');
}


/**
 *
 * @param {string} id The id of the restaurant to update
 * @param {string} name The name of the restaurant
 * @param {string} location The location of the restaurant
 * @param {string} phoneNumber The phone number of the restaurant: xxx-xxx-xxxx
 * @param {string} website The website of the restaurant: http://www._____.com
 * @param {string} priceRange The price range of the restaurant: $-$$$$
 * @param {[string]} cuisines The cuisines offered at the restaurant
 * @param {object} serviceOptions The service options: delivery, takeout, etc
 * @return {object} The inserted object
 */
async function update(id, name, location, phoneNumber, website,
    priceRange, cuisines, serviceOptions) {
  ({
    name, location, phoneNumber, website,
    priceRange, cuisines, serviceOptions,
  } =
    trimAndValidate(name, location, phoneNumber,
        website, priceRange, cuisines, serviceOptions));
  id = tryTrim(id);
  validateId(id);
  const collection = await getCollection();
  const objToInsert = {
    'name': name,
    'location': location,
    'phoneNumber': phoneNumber,
    'website': website,
    'priceRange': priceRange,
    'cuisines': cuisines,
    'overallRating': 0,
    'serviceOptions': serviceOptions,
    'reviews': [],
  };

  const inserted = await collection.insertOne(objToInsert);

  if (!inserted.acknowledged) {
    throw Error('Something went wrong during insertion');
  }
  // Assign id first so it gets to the top of the keys
  const insertedId = inserted.insertedId.toString();
  const objToReturn = {'_id': insertedId};

  // Combine the two objects, which messes up the id key
  Object.assign(objToReturn, objToInsert);

  // Reassign the id key
  objToReturn._id = insertedId;

  return objToReturn;
}

module.exports = {create, getAll, get, update, remove};
