const restaurantData = require('../data/restaurants');
const restaurantExtras = require('../data/restaurantsExtras');
const validate = require('../data/validate');
const handleError = require('./errorHandling');

const express = require('express');
const router = new express.Router();

router.get('/', async (req, res) => {
  try {
    const retObj = await restaurantExtras.getAndProcess(undefined, true, false);
    res.status(200).json(retObj);
  } catch (e) {
    handleError(e, res);
  }
});

router.post('/', async (req, res) => {
  const info = req.body;
  console.log('Req: ' + req);
  console.log('Info: ' + info);
  if (!info) {
    res.status(400).json({
      error: 'Must pass in parameters to create a restaurant',
    });
    return;
  }
  try {
    restaurantExtras.trimAndValidate(
        info.name,
        info.location,
        info.phoneNumber,
        info.website,
        info.priceRange,
        info.cuisines,
        info.serviceOptions,
    );
  } catch (e) {
    handleError(e, res);
    return;
  }
  try {
    const created = await restaurantData.create(
        info.name,
        info.location,
        info.phoneNumber,
        info.website,
        info.priceRange,
        info.cuisines,
        info.serviceOptions,
    );
    res.status(201).json(created);
    console.log('Created response was: ' + created);
  } catch (e) {
    handleError(e, res);
    return;
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    validate.validateId(id);
    const obj = await restaurantData.get(id);
    if (obj) {
      res.status(200).json(obj);
    } else res.status(404).json({message: 'Not found'});
  } catch (e) {
    handleError(e, res); return;
  }
});

router.put('/:id', async (req, res) => {
  const info = req.body;
  console.log('Info: ' + info);
  if (!info) {
    res.status(400).json({
      error: 'Must pass in parameters to create a restaurant',
    });
    return;
  }
  try {
    restaurantExtras.trimAndValidate(
        info.name,
        info.location,
        info.phoneNumber,
        info.website,
        info.priceRange,
        info.cuisines,
        info.serviceOptions,
    );
    validate.validateId(req.params.id);
  } catch (e) {
    handleError(e, res);
    return;
  }
  let updated = undefined;
  try {
    updated = await restaurantData.update(
        req.params.id,
        info.name,
        info.location,
        info.phoneNumber,
        info.website,
        info.priceRange,
        info.cuisines,
        info.serviceOptions,
    );
  } catch (e) {
    handleError(e, res); return;
  }
  if (updated) {
    res.status(200).json(updated);
  } else res.status(404).json({message: 'Not found'});
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    validate.validateId(id);
    await restaurantData.remove(id);
  } catch (e) {
    handleError(e, res); return;
  }
  res.status(200).json({
    restaurantId: id,
    deleted: true,
  });
});

router.get('*', async (req, res) => {
  res.status(404).json({message: 'Not Found'});
});
router.post('*', async (req, res) => {
  res.status(404).json({message: 'Not Found'});
});
router.put('*', async (req, res) => {
  res.status(404).json({message: 'Not Found'});
});
router.delete('*', async (req, res) => {
  res.status(404).json({message: 'Not Found'});
});
router.patch('*', async (req, res) => {
  res.status(404).json({message: 'Not Found'});
});

module.exports = router;

