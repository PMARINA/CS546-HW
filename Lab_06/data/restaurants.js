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
    cuisines.forEach((element)=>
      newCuisines.push(tryTrim(element)),
    );
    cuisines = newCuisines;
  } catch (e) {}

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
  ({name, location, phoneNumber, website,
    priceRange, cuisines, serviceOptions} =
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
  id = tryTrim(id);
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
  ({name, location, phoneNumber, website,
    priceRange, cuisines, serviceOptions} =
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

/**
 * Update the average rating for a given restaurant
 * @param {string} id The id of the restaurant whose ratings need to be refreshed
 */
async function updateRatingsFromReviews(id){
  validateId(id);
  let col = await getCollection();
  const colName = col.s.namespace.collection;
  const averageReviewsOp = {"$divide": [{"$sum": "$reviews.rating"}, {"$size":"$reviews"}]}
  const mongId = new mdb.ObjectId(id);
  await col.aggregate([{"$match":{"_id":mongId}}, {"$set": {"totalRating": averageReviewsOp}}, {"$merge":{into:colName, whenMatched:"merge"}}]);
}

module.exports = {create, getAll, get, update, updateRatingsFromReviews, remove};
