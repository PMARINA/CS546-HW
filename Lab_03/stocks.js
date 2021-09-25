/* eslint-disable max-len */
const data = require('./dataConfig');
const people = require('./people');
let stockData = null;

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
  if (typeof(stockName)!== 'string') throw Error('bad input');
  if ( stockName.trim().length === 0) throw Error('empty input');
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


// module.exports = {listShareholders, topShareholders, listStocks, getStockById};
/**
 * Do something
 */
async function main() {
  const something = await topShareholder('Aeglea BioTherapeutics, Inc.').catch((e)=>console.log(e));
  console.log(something);
  return;
  // <stackOverflowSnippet src="https://stackoverflow.com/a/10729284">
  const util = require('util');
  console.log(util.inspect(something, {showHidden: false, depth: null, colors: true}));
  // </stackOverflowSnippet>
}

main();
