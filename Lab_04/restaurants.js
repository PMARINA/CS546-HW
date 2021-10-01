// const dbConnection = require('./mongoConnection');
const getCollection = require('./mongoCollections').restaurants;
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
} = require('./validate'));

/**
 *
 * @param {string} name The name of the restaurant
 * @param {string} location The location of the restaurant
 * @param {string} phoneNumber The phone number of the restaurant: xxx-xxx-xxxx
 * @param {string} website The website of the restaurant: http://www._____.com
 * @param {string} priceRange The price range of the restaurant: $-$$$$
 * @param {[string]} cuisines The cuisines offered at the restaurant
 * @param {number} overallRating The overall rating of the restaurant: 0-5
 * @param {object} serviceOptions The service options: delivery, takeout, etc
 * @return {object} The inserted object
 */
async function create(name, location, phoneNumber, website,
    priceRange, cuisines, overallRating, serviceOptions) {
  try {
    name = name.trim();
  } catch (e) {}
  try {
    location = location.trim();
  } catch (e) {}
  try {
    phoneNumber = phoneNumber.trim();
  } catch (e) {}
  try {
    website = website.trim();
  } catch (e) {}
  try {
    priceRange = priceRange.trim();
  } catch (e) {}
  try {
    newCuisines = [];
    cuisines.forEach((element)=>
      newCuisines.push(element.trim()),
    );
    cuisines = newCuisines;
  } catch (e) {}

  validateName(name);
  validateLocation(location);
  validatePhoneNumber(phoneNumber);
  validateWebsite(website);
  validatePriceRange(priceRange);
  validateCuisines(cuisines);
  validateOverallRating(overallRating);
  validateServiceOptions(serviceOptions);

  const collection = await getCollection();
  const objToInsert = {
    'name': name,
    'location': location,
    'phoneNumber': phoneNumber,
    'website': website,
    'priceRange': priceRange,
    'cuisines': cuisines,
    'overallRating': overallRating,
    'serviceOptions': serviceOptions,
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
 * @return {[object]}
 */
async function getAll() {
  const collection = await getCollection();
  arrWithObjectIds = await collection.find({}).toArray();
  // change the ObjectId objs to strings
  arrWithObjectIds.forEach((element) => {
    element._id = element._id.toString();
  });
  return arrWithObjectIds;
}

/**
 * Find and return the restaurant from the db
 * @param {string} id The id of the object to retrieve
 * @return {object} The requested restaurant
 */
async function get(id) {
  try {
    id = id.trim();
  } catch (e) {}
  validateId(id);
  const collection = await getCollection();
  const foundRestaurant =
    await collection.findOne({'_id': new mdb.ObjectId(id)});
  if (!foundRestaurant) throw Error('Unable to find result for specified id');
  foundRestaurant._id = foundRestaurant._id.toString();
  return foundRestaurant;
}

/**
 * Delete a restaurant given its id
 * @param {string} id The id of the restaurant to delete
 * @return {string} A status message if deleted successfully
 */
async function remove(id) {
  try {
    id = id.trim();
  } catch (e) {}
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
 * Replace the website of the existing restaurant with the new website.
 * @param {string} id The id of the restaurant in the database
 * @param {string} newWebsite The new website of the restaurant
 * @return {object} The new object, as stored in the db
 */
async function rename(id, newWebsite) {
  try {
    id = id.trim();
  } catch (e) {}
  try {
    newWebsite = newWebsite.trim();
  } catch (e) {}

  validateId(id);
  validateWebsite(newWebsite);

  const collection = await getCollection();

  // Assert that it exists
  const existingDocument = await get(id);

  if (existingDocument.website === newWebsite) {
    throw Error('Website is exactly the same.');
  }

  collection.updateOne({'_id': new mdb.ObjectId(id)},
      {'$set': {'website': newWebsite}});

  return await get(id);
}

module.exports = {create, getAll, get, remove, rename};
