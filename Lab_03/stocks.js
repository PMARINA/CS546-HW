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
// module.exports = {listShareholders, topShareholders, listStocks, getStockById};
/**
 * Do something
 */
async function main() {
  const something = await listShareholders().catch((e)=>console.log(e));
  // <stackOverflowSnippet src="https://stackoverflow.com/a/10729284">
  const util = require('util');
  console.log(util.inspect(something, {showHidden: false, depth: null, colors: true}));
  // </stackOverflowSnippet>
}

main();
