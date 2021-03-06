
const getCollection = require('../config/mongoCollections').restaurants;
const restaurants = require('./restaurants');
const ServerSideError = require('./errors').ServerSideError;
// const ClientSideError = require('./errors').ClientSideError;
const ResourceNotFoundError = require('./errors').ResourceNotFoundError;
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
  const res = await restaurantsCollection.aggregate([
    // Get only the restaurant with the id (assume it's always unique)
    {'$match': {'_id': mongoIdToMatch}},
    // Get the average rating using the predefined operation
    {'$set': {'overallRating': averageReviewsOp}},
    // Merge the result back into the original document
    {'$merge': {into: colName, whenMatched: 'merge'}}]);
  await res.toArray();
  // MongoDB is lazy --- this line actually causes the operation to happen
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
  [restaurantId, title, reviewer, review].forEach((s) => validateName(s));
  validateDate(dateOfReview);
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
    throw new ServerSideError(
        'Database did not acknowledge creation of review from ' +
      `${reviewer} for ${restaurantId}`,
    );
  }
  if (result.matchedCount !== 1) {
    throw new ResourceNotFoundError(
        `Restaurant either has nonunique ID, or does not exist.`,
    );
  }
  await updateRestaurantAverageRating(restaurantId);
  return await restaurants.get(restaurantId);
}

/**
 * Get all reviews for a given restaurant.
 * @param {string} restaurantId Id of the restaurant
 */
async function getAll(restaurantId) {
  restaurantId = tryTrim(restaurantId);

  validateId(restaurantId);
  const filter = {_id: restaurantId};
  const matchingStage = {
    $match: filter,
  };
  const getReviewsOnly = {$replaceWith: {'result': '$reviews'}};
  const updateIds = {
    $set: {
      'result': {
        $map: {
          input: '$result',
          as: 'inVal',
          in: {
            $setField: {
              field: '_id',
              input: '$$inVal',
              value: {
                $convert: {
                  input: '$$inVal._id',
                  to: 'string',
                },
              },
            },
          },
        },
      },
    },
  };
  const pipeline = [matchingStage, getReviewsOnly, updateIds];
  let res = await col.aggregate(pipeline);
  res = await res.toArray();
  if (!res) {
    throw new ResourceNotFoundError(`No restaurant by ID (${id}) exists`);
  }
  return res[0].result;
}
/**
 * Get the review with specified ID if it exists.
 * @param {string} reviewId The id of the review to fetch.
 * @return {object} Returns the object requested.
 */
async function get(reviewId) {
  const col = await getCollection();
  reviewId = tryTrim(reviewId);
  validateId(reviewId);
  const filter = {'reviews._id': new mdb.ObjectId(reviewId)};
  const matchingStage = {
    $match: filter,
  };

  const getReviewsOnly = {$replaceWith: {'result': '$reviews'}};

  const unwindArr = {$unwind: '$result'};

  const matchIdInSubDoc = {$match: {'result._id': new mdb.ObjectId(reviewId)}};

  const convertType = {
    $addFields: {
      'result._id': {
        '$convert': {
          input: '$$CURRENT.result._id',
          to: 'string',
        },
      },
    },
  };

  results = await col.aggregate(
      [matchingStage, getReviewsOnly, unwindArr, matchIdInSubDoc, convertType],
  );
  results = await results.toArray();
  if (!results || results.length === 0) {
    throw new ResourceNotFoundError(`No review by id (${reviewId}) exists.`);
  }
  return results[0].result;
}

/**
 * Remove an id from a restaurant's DB entry.
 * @param {string} reviewId The id of the review to remove.
 */
async function remove(reviewId) {
  reviewId = tryTrim(reviewId);
  validateId(reviewId);

  // Ensure that the review exists
  review = await get(reviewId);

  // Delete the review
  const col = await getCollection();
  const restaurantDocument = await col.findOne(
      {'reviews._id': new mdb.ObjectId(reviewId)},
  );
  // console.log('Found Document: ' + restaurantDocument);
  if (! restaurantDocument) {
    throw new ResourceNotFoundError('The review was not found.');
  }
  const restaurantId = restaurantDocument._id;
  updateResult = await col.updateOne(
      {_id: restaurantId},
      {
        $pull:
        {
          reviews:
            {_id: new mdb.ObjectId(reviewId)},
        },
      },
  );

  if (!updateResult.acknowledged) {
    throw new ServerSideError(
        'Database failed to acknowledge pulling the review ' +
        'from the restaurant\'s document.',
    );
  }
  // console.log(JSON.stringify(updateResult));
  if (updateResult.modifiedCount !== 1) {
    // This shouldn't happen
    // 1. The get operation ensures it actually exists
    // 2. MongoDB ObjectIds are guaranteed to be unique
    throw new ServerSideError('Multiple reviews deleted due to nonunique ID');
  }

  await updateRestaurantAverageRating(restaurantId.toString());
}

module.exports = {create, getAll, get, remove};

