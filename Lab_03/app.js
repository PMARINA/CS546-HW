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
  if (result)console.log(result);
}

// People code testing

// getPersonById

// Verify the following fail with errors due to input:

// test(people.getPersonById);
// test(people.getPersonById, 1);
// test(people.getPersonById, -1);
// test(people.getPersonById, 1001);
// test(people.getPersonById, '    ');


// Verify these fail due to id not found

// test(people.getPersonById, 'abcde');
// test(person.getPersonById, '7989fa5e-5617-43f7-a931-46036f9dbcff'); // Throws person not found Error


// Val Kinsel

// test(people.getPersonById, '7989fa5e-8f3f-458d-ad58-23c8d9ef5a10');


// sameStreet

// Verify the following fail with errors due to input
// test(people.sameStreet, 1, 'Street');
// test(people.sameStreet, 'Street', 1);
// test(people.sameStreet, 'Street');
// test(people.sameStreet);

// Throws Error since there are not at least two people that live or work on Crownhardt Park
// test(people.sameStreet, 'Crownhardt', 'Park');

// Emlynn Sawter - work
// Billie Lude - home
// Armando Pomery - work
// test(people.sameStreet, 'Sutherland', 'Point');

// Verify that output is similar to the expected format... not much else can be verified.
// test(people.manipulateSsn);

// test(people.sameBirthday, 09, 25); // Returns: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge']
// test(people.sameBirthday, 9, 25); // Returns: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge']
// test(people.sameBirthday, '09', '25'); // Returns: ['Khalil Ovitts',  'Erny Van Merwe', 'Emanuel Saben', 'Iorgos Tembridge'] because the parameters can be parsed into valid numbers.
// test(people.sameBirthday, 9, 31); // Err 31 days in september
// test(people.sameBirthday, 13, 25); // Err month out of range
// test(people.sameBirthday, 2, 29); // February with no leap years...
// test(people.sameBirthday, '09', '31'); // 31 Days in september...
// test(people.sameBirthday, '      ', '25'); // spaces for month...
// test(people.sameBirthday); // no args...


