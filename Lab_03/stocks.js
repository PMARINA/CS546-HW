/* eslint-disable max-len */
const data = require('./dataConfig');
const people = require('./people');
const checkString = require('./checks').checkString;
let stockData = null;
let peopleData = null;
/**
 * List shareholders
 */
async function listShareholders() {
  if (stockData === null) stockData = await data.getStocks();
  retStockData = [];
  for (const stock of stockData) {
    shareholders = stock.shareholders;
    stockCopy = {};
    Object.assign(stockCopy, stock);
    newShareHolders = [];
    for (const holder of shareholders) {
      id = holder.userId;
      // console.log(holder);
      // console.log(`Holder ID: ${id}`);
      numShares = holder.number_of_shares;
      const person = await people.getPersonById(id);
      newShareHolders.push({
        'first_name': person.first_name,
        'last_name': person.last_name,
        'number_of_shares': numShares,
      });
    }
    stockCopy.shareholders = newShareHolders;
    retStockData.push(stockCopy);
  }
  return retStockData;
}

/**
 * Return who the top shareholder of the stock is
 * @param {string} stockName The name of the stock
 * @return {string} A top shareholder of the stock
 */
async function topShareholder(stockName) {
  checkString(stockName);
  const shareholders = await listShareholders();
  for (const stock of shareholders) {
    const iteratingStockName = stock.stock_name;
    if (iteratingStockName === stockName) {
      const holders = stock.shareholders;
      if (holders.length === 0) return `${iteratingStockName} currently has no shareholders.`;
      let numShares = 0;
      let topHolder = null;
      for (const holder of holders) {
        if (holder.number_of_shares > numShares) {
          numShares = holder.number_of_shares;
          topHolder = `${holder.first_name} ${holder.last_name}`;
        }
      }
      return `With ${numShares} shares in ${iteratingStockName}, ${topHolder} is the top shareholder.`;
    }
  }
  throw Error('No stock with that name');
}

/**
 * Return all stocks, quantities owned by the person.
 * @param {string} firstName First Name to look for
 * @param {string} lastName Last Name to look for
 */
async function listStocks(firstName, lastName) {
  checkString(firstName);
  checkString(lastName);
  if (peopleData === null) peopleData = await data.getPeople();
  if (stockData === null) stockData = await data.getStocks();
  let personId = null;
  for (const person of peopleData) {
    if (person.first_name === firstName && person.last_name === lastName) {
      personId = person.id;
      break;
    }
  }
  if (personId === null) throw Error('Person with given names not found in the database of people');
  retArr = [];
  for (const stock of stockData) {
    shareholders = stock.shareholders;
    for (const holder of shareholders) {
      if (holder.userId === personId) {
        stockName = stock.stock_name;
        numShares = holder.number_of_shares;
        retArr.push({
          'stock_name': stockName,
          'number_of_shares': numShares,
        });
        break;
      }
    }
  }
  if (retArr.length === 0) throw Error('Person does not own any stocks');
  return retArr;
}

/**
 * Get a stock given its id
 * @param {string} id of the stock
 * @return {object} The stock
 */
async function getStockById(id) {
  checkString(id);
  if (stockData === null)stockData = await data.getStocks();
  for (const stock of stockData) {
    if (stock['id'] === id) return stock;
  }
  throw Error('stock not found');
}

module.exports = {listShareholders, topShareholder, listStocks, getStockById};
