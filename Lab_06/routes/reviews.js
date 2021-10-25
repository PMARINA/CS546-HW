const restaurantData = require('../data/restaurants');
const reviewData = require('../data/reviews');
// const restaurantExtras = require('../data/restaurantsExtras');
const validate = require('../data/validate');

({ResourceNotFoundError, ClientSideError, ServerSideError} =
  require('../data/errors'));

const handleError = require('./errorHandling');


const express = require('express');
const router = new express.Router();

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    validate.validateId(id);
    const restaurant = await restaurantData.get(id);
    if (! restaurant) {
      throw new ResourceNotFoundError(`Restaurant with id  ${id} not found`);
    }
    const reviews = restaurant.reviews;
    if (!reviews) {
      // console.log(JSON.stringify(reviews));
      res.status(404).json(
          {message: `No reviews for restaurant with id ${id}`},
      );
    }
    res.status(200).json(reviews);
  } catch (e) {
    handleError(e, res); return;
  }
});

router.post('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    validate.validateId(id);
    const info = req.body;
    validate.validateName(info.title);
    validate.validateName(info.reviewer);
    validate.validateOverallRating(info.rating);
    validate.validateDate(info.dateOfReview);
    validate.validateDateIsToday(info.dateOfReview);
    validate.validateName(info.review);
    const modifiedRestaurant = await reviewData.create(
        id,
        info.title,
        info.reviewer,
        info.rating,
        info.dateOfReview,
        info.review,
    );
    res.status(200).json(modifiedRestaurant);
  } catch (e) {
    handleError(e, res); return;
  }
});

router.get('/review/:id', async (req, res) => {
  id = req.params.id;
  try {
    validate.validateId(id);
    const review = await reviewData.get(id);
    res.status(200).json(review);
  } catch (e) {
    handleError(e, res); return;
  }
});

router.delete('/:id', async (req, res) => {
  try {
    validate.validateId(req.params.id);
    await reviewData.remove(req.params.id);
    res.status(200).json({
      reviewId: req.params.id,
      deleted: true,
    });
  } catch (e) {
    handleError(e, res); return;
  }
});

routeNotFound = async (req, res) => {
  res.status(404).json({
    message: 'The provided route was not found on this server.'});
};

router.get('*', routeNotFound);
router.post('*', routeNotFound);
router.put('*', routeNotFound);
router.delete('*', routeNotFound);
router.patch('*', routeNotFound);

module.exports = router;

