// const dbConnection = require('./mongoConnection');
const getCollection = require('../config/mongoCollections').restaurants;
const mdb = require('mongodb');
const ServerSideError = require('./errors').ServerSideError;
// const ClientSideError = require('./errors').ClientSideError;
const ResourceNotFoundError = require('./errors').ResourceNotFoundError;
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
const getAndProcess = require('./restaurantsExtras').getAndProcess;
const trimAndValidate = require('./restaurantsExtras').trimAndValidate;

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
    throw new ServerSideError('Something went wrong during insertion');
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
  const arrWithObjectIds = getAndProcess(null, true, true);
  return arrWithObjectIds;
}


/**
 * Find and return the restaurant from the db
 * @param {string} id The id of the object to retrieve
 * @return {object} The requested restaurant
 */
async function get(id) {
  id = tryTrim(id);
  validateId(id);
  const res = await getAndProcess(id, false, true);
  const foundRestaurant = res;
  if (!res) {
    throw new ResourceNotFoundError('Unable to find result for specified id');
  }
  // foundRestaurant._id = foundRestaurant._id.toString();
  return foundRestaurant[0];
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

  const result =
    await collection.deleteOne({'_id': new mdb.ObjectId(id)});
  console.log(JSON.stringify(result));
  if (result.deletedCount === 1) {
    return;
  }
  throw new ResourceNotFoundError(`Unable to remove object with id: ${id}.` +
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
    'serviceOptions': serviceOptions,
  };

  const updated = await collection.findOneAndUpdate(
      {_id: new mdb.ObjectId(id)},
      {$set: objToInsert},
      {returnNewDocument: true},
  );

  if (!updated.ok) {
    throw new ResourceNotFoundError('Something went wrong during update.' +
    ' Does the restaurant exist?');
  }

  return await get(id);
}

module.exports = {create, getAll, get, update, remove};
