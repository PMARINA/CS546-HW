/* eslint-disable max-len */
people = require('./people');
stocks = require('./stocks');

/**
 * Test a function and log its result, even if it errors
 * @param {function} callback The function to test
 */
async function test(callback, ...args) {
  const result = await callback(...args).catch((e)=>{
    console.log(e);
  });
  if (result && typeof(result) === 'object') {
    const util = require('util');
    console.log(util.inspect(result, {showHidden: false, depth: null, colors: true}));
  } else if (result) {
    console.log(result);
  }
}

// Uncomment 1 by 1 because otherwise the async nature will return everything out of order = hard to correlate...

// People code testing

// getPersonById

// Verify the following fail with errors due to input:

test(people.getPersonById);
test(people.getPersonById, 1);
test(people.getPersonById, -1);
test(people.getPersonById, 1001);
test(people.getPersonById, '    ');


// Verify these fail due to id not found

test(people.getPersonById, 'abcde');
test(people.getPersonById, '7989fa5e-5617-43f7-a931-46036f9dbcff'); // Throws person not found Error


// Val Kinsel

test(people.getPersonById, '7989fa5e-8f3f-458d-ad58-23c8d9ef5a10');


// sameStreet

// Verify the following fail with errors due to input
test(people.sameStreet, 1, 'Street');
test(people.sameStreet, 'Street', 1);
test(people.sameStreet, 'Street');
test(people.sameStreet);

// Throws Error since there are not at least two people that live or work on Crownhardt Park
test(people.sameStreet, 'Crownhardt', 'Park');

// Emlynn Sawter - work
// Billie Lude - home
// Armando Pomery - work
test(people.sameStreet, 'Sutherland', 'Point');

// Verify that output is similar to the expected format... not much else can be verified.
test(people.manipulateSsn);

test(people.sameBirthday, 09, 25); // Returns: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge']
test(people.sameBirthday, 9, 25); // Returns: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge']
test(people.sameBirthday, '09', '25'); // Returns: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge'] because the parameters can be parsed into valid numbers.
test(people.sameBirthday, 9, 31); // Err 31 days in september
test(people.sameBirthday, 13, 25); // Err month out of range
test(people.sameBirthday, 2, 29); // February with no leap years...
test(people.sameBirthday, '09', '31'); // 31 Days in september...
test(people.sameBirthday, '      ', '25'); // spaces for month...
test(people.sameBirthday); // no args...

// Test stocks things...

// Check if first few rows match expected...
test(stocks.listShareholders);

// Returns: "With 449 shares in Aeglea BioTherapeutics, Inc., Caresse Clissett is the top shareholder."
test(stocks.topShareholder, 'Aeglea BioTherapeutics, Inc.');

// Returns: "With 372 shares in Nuveen Floating Rate Income Fund, Thorstein Sarjeant is the top shareholder."
test(stocks.topShareholder, 'Nuveen Floating Rate Income Fund');

// Returns: "Powell Industries, Inc. currently has no shareholders."
test(stocks.topShareholder, 'Powell Industries, Inc.');

test(stocks.topShareholder, 43);
test(stocks.topShareholder, '     ');
test(stocks.topShareholder, 'Foobar Inc');
test(stocks.topShareholder);

test(stocks.listStocks, 'Grenville', 'Pawelke');
test(stocks.listStocks, 'Patrick', 'Hill');
test(stocks.listStocks);
test(stocks.listStocks, 'foo');
test(stocks.listStocks, '      ', '        ');
test(stocks.listStocks, 1, 2);

test(stocks.getStockById, 'f652f797-7ca0-4382-befb-2ab8be914ff0');
test(stocks.getStockById, -1);
test(stocks.getStockById, 1001);
test(stocks.getStockById);
test(stocks.getStockById, '7989fa5e-5617-43f7-a931-46036f9dbcff');
