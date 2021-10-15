
const getCollection = require('./config/mongoCollections').restaurants;
const restaurants = require('./restaurants');
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
  tryTrim,
  validateId,
  validateDate,
  validateDateIsToday,
} = require('./validate'));

/**
 * Update the average rating for a given restaurant
 *
 * @param {string} fromRestaurantId The id of the restaurant
 * whose ratings need to be refreshed
 */
async function updateRestaurantAverageRating(fromRestaurantId) {
  validateId(fromRestaurantId);
  const restaurantsCollection = await getCollection();
  const colName = restaurantsCollection.s.namespace.collection;
  const averageReviewsOp =
  {
    $cond:
    {
      // If there's more than 1 review for the restaurant
      if: {$gt: [{$size: '$reviews'}, 0]},
      // Perform the average operation
      then: {
        '$divide':
          [
            {'$sum': '$reviews.rating'},
            {'$size': '$reviews'},
          ],
      },
      // Otherwise, reset the average rating to 0
      else: 0,
    },
  };
  const mongoIdToMatch = new mdb.ObjectId(fromRestaurantId);
  await restaurantsCollection.aggregate([
    // Get only the restaurant with the id (assume it's always unique)
    {'$match': {'_id': mongoIdToMatch}},
    // Get the average rating using the predefined operation
    {'$set': {'overallRating': averageReviewsOp}},
    // Merge the result back into the original document
    {'$merge': {into: colName, whenMatched: 'merge'}}]);
}

/**
 * Create a review for a restaurant
 * @param {string} restaurantId The id of the restaurant
 * @param {string} title The title of the review
 * @param {string} reviewer The reviewer leaving the review
 * @param {number} rating The rating 1-5 for the restaurant
 * @param {string} dateOfReview The date of the review
 * @param {string} review The review text
 */
async function create(restaurantId,
    title, reviewer, rating, dateOfReview, review) {
  restaurantId = tryTrim(restaurantId);
  title = tryTrim(title);
  reviewer = tryTrim(reviewer);
  dateOfReview = tryTrim(dateOfReview);
  review = tryTrim(review);

  validateId(restaurantId);
  [restaurantId, title, reviewer, review].forEach((s)=>validateName(s));
  validateDate(dateofReview);
  validateDateIsToday(dateOfReview);

  const reviewObj = {
    '_id': new mdb.ObjectId(),
    'title': title,
    'reviewer': reviewer,
    'rating': rating,
    'dateOfReview': dateOfReview,
    'review': review,
  };
  const restObjId = new mdb.ObjectId(restaurantId);

  const filter = {_id: restObjId};
  const operation = {'$push': {'reviews': reviewObj}};

  const restaurantsCollection = await getCollection();
  result = await restaurantsCollection.updateOne(filter, operation);
  if (!result.acknowledged) {
    throw Error(
        'Database did not acknowledge creation of review from ' +
        `${reviewer} for ${restaurantId}`,
    );
  }
  if (result.matchedCount !== 1) {
    throw Error(`Restaurant either has nonunique ID, or does not exist.`);
  }
  await updateRestaurantAverageRating(restaurantId);
  return await restaurants.get(restaurantId);
}
async function getAll(restaurantId) {

}
async function get(reviewId) {

}
async function remove(reviewId) {

}

module.exports = {create, getAll, get, remove};

