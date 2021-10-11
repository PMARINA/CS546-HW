const express = require('express');
const router = new express.Router();
const data = require('../data');
const stockData = data.stocks;

router.get('/:id', async (req, res) => {
  try {
    const stockInfo = await stockData.getStockById(req.params.id);
    res.json(stockInfo);
  } catch (e) {
    res.status(404).json({
      message: e.toString(),
    });
  }
});

router.get('/', async (_req, res) => {
  try {
    const stocksList = await stockData.getAllStocks();
    res.json(stocksList);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
