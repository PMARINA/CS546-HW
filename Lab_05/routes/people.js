const express = require('express');
const router = new express.Router();
const data = require('../data');
const peopleData = data.people;

router.get('/:id', async (req, res) => {
  try {
    const person = await peopleData.getPersonById(req.params.id);
    res.json(person);
  } catch (e) {
    res.status(404).json({
      message: e.toString(),
    });
  }
});

router.get('/', async (_req, res) => {
  try {
    const peopleList = await peopleData.getAllPeople();
    res.json(peopleList);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
