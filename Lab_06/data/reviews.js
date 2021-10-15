
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
  tryTrim,
  validateId,
  validateDate,
  validateDateIsToday,
} = require('./validate'));

/**
 * Create a review for a restaurant
 * @param {string} restaurantId The id of the restaurant
 * @param {string} title The title of the review
 * @param {string} reviewer The reviewer leaving the review
 * @param {number} rating The rating 1-5 for the restaurant
 * @param {string} dateOfReview The date of the review
 * @param {string} review The review text
 */
async function create(restaurantId, title, reviewer, rating, dateOfReview, review) {
  restaurantId = tryTrim(restaurantId);
  title = tryTrim(title);
  reviewer = tryTrim(reviewer);
  dateOfReview = tryTrim(dateOfReview);
  review = tryTrim(review);

  validateId(restaurantId);
  [restaurantId, title, reviewer, review].forEach((s)=>validateName(s));
  validateDate(dateofReview);
  validateDateIsToday(dateOfReview);
}
async function getAll(restaurantId) {

}
async function get(reviewId) {

}
async function remove(reviewId) {

}

module.exports = {create, getAll, get, remove};

