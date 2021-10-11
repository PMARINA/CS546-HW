axios = require('axios');
validate = require('./validate');

const STOCKS_URL = 'https://gist.githubusercontent.com/graffixnyc/8c363d85e61863ac044097c0d199dbcc/raw/7d79752a9342ac97e4953bce23db0388a39642bf/stocks.json';
const PEOPLE_URL = 'https://gist.githubusercontent.com/graffixnyc/a1196cbf008e85a8e808dc60d4db7261/raw/9fd0d1a4d7846b19e52ab3551339c5b0b37cac71/people.json';

let stockData = null;
let peopleData = null;

/**
 * Ensure that peopleData is initialized
 */
async function ensurePeopleData() {
  if (peopleData === null) {
    peopleData = (await axios.get(PEOPLE_URL)).data;
  }
}
/**
 * Ensure that stockData is initialized
 */
async function ensureStockData() {
  if (stockData === null) {
    stockData = (await axios.get(STOCKS_URL)).data;
  }
  return stockData;
}

/**
 *
 * @param {string} id The id of the person to get
 * @return {object} The person requested
 */
async function getPerson(id) {
  validate.validateId(id);
  await ensurePeopleData();
  id = id.trim();
  let person = null;
  peopleData.forEach((p) => {
    if (p.id === id) {
      person = p;
    }
  });
  if (person === null) {
    throw Error(`No person with id: ${id}`);
  }
  return person;
}

/**
 *
 * @return {object} All people data
 */
async function getPeople() {
  await ensurePeopleData();
  return peopleData;
}

/**
 *
 * @param {string} id The id of the stock to get
 * @return {object} The stock requested
 */
async function getStock(id) {
  validate.validateId(id);
  await ensureStockData();
  id = id.trim();
  retStock = null;
  stockData.forEach((s) => {
    if (s['id'] === id) {
      retStock = s;
    }
  });
  if (retStock === null) {
    throw Error(`No stock with id: ${id}`);
  }
  return retStock;
}
/**
 *
 * @return {object} All stock data
 */
async function getStocks() {
  await ensureStockData();
  return stockData;
}

module.exports = {
  'people': {
    getPersonById: getPerson,
    getAllPeople: getPeople,
  },
  'stocks': {
    getStockById: getStock,
    getAllStocks: getStocks,
  },
};
