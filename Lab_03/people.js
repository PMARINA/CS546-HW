/* eslint-disable max-len */

const data = require('./dataConfig');
let peopleData = null;
/**
 * Return a person given their id
 * @param {string} id The id of the person to search for
 * @return {object} The person with the id
 */
async function getPersonById(id) {
  if (id === undefined) {
    throw Error('ID was undefined');
  }
  if (typeof(id) !== 'string') {
    throw Error('ID was not of the correct type: string');
  }
  if (id.trim().length === 0) throw Error('Empty/whitespace id not valid.');
  if (peopleData === null) peopleData = await data.getPeople();
  let personData = null;
  peopleData.forEach((p) => {
    if (p['id'] === id) {
      personData = p;
    }
  });

  if (personData === null) {
    throw Error('person not found');
  }
  //   console.log(personData);
  return personData;
}

/**
 * Fix 2+ people living on the same street
 * @param {string} streetName The name of the street
 * @param {string} streetSuffix The suffix of the street
 */
async function sameStreet(streetName, streetSuffix) {
  if (typeof(streetName) !== 'string' || typeof(streetSuffix) !== 'string') {
    throw Error('The inputs were not valid');
  }
  if (streetName.trim().length === 0 || streetSuffix.trim().length === 0) {
    throw Error('The inputs must not be empty/whitespace');
  }
  streetName= streetName.toLowerCase();
  streetSuffix = streetSuffix.toLowerCase();
  if (peopleData === null) peopleData = await data.getPeople();
  const matchingPeople = new Set();
  let pSName = '';
  let pSSuff = '';
  peopleData.forEach((p) => {
    ([p['address']['home'], p['address']['work']]).forEach((addr) => {
      pSName = addr['street_name'].toLowerCase();
      pSSuff = addr['street_suffix'].toLowerCase();
      if (pSName === streetName && pSSuff === streetSuffix) {
        matchingPeople.add(p);
      }
    });
  });
  if (matchingPeople.size < 2) {
    // eslint-disable-next-line max-len
    throw Error('No more than 1 person in our data base lives on the given street');
  }
  const returnArr = Array.from(matchingPeople);
  console.log(returnArr);
  return returnArr;
}

/**
 * Return the statistics of the SSN
 */
async function manipulateSsn() {
  if (peopleData === null) peopleData = await data.getPeople();
  let maxSSN = parseInt((peopleData[0]['ssn']).replace(/-/g, ''));
  let minSSN = maxSSN;
  let sumSSN = 0;
  let count = 0;
  let minSSNPerson = {};
  let maxSSNPerson= {};
  peopleData.forEach((p) => {
    // console.log(p['ssn']);
    // console.log(typeof(p['ssn']));
    const ssn = parseInt((p['ssn']).replace(/-/g, ''));
    // console.log(ssn);
    count++;
    if (ssn < minSSN) {
      minSSN = ssn;
      minSSNPerson = p;
    } else if (ssn > maxSSN) {
      maxSSN = ssn;
      maxSSNPerson = p;
    }
    sumSSN += ssn;
  });
  const average = Math.floor(sumSSN/count);
  const returnObj = {
    'highest': {'firstName': maxSSNPerson['first_name'], 'lastName': maxSSNPerson['last_name']},
    'lowest': {'firstName': minSSNPerson['first_name'], 'lastName': minSSNPerson['last_name']},
    'average': average,
  };
  console.log(returnObj);
  return returnObj;
}

/**
 * Find people with the given birthday
 * @param {number} month the index of the month
 * @param {number} day the day of the month
 */
async function sameBirthday(month, day) {
  if ((typeof(month) !== 'number' && isNaN(month)) || (typeof(day) !== 'number' && isNaN(day))) throw Error('Invalid input');
  month = typeof(month) === 'number' ? month : parseInt(month);
  day = typeof(day) === 'number' ?day : parseInt(day);
  if ( month < 1 || month > 12) throw Error('Month out of range');
  if ( day < 1 || day > 31) throw Error('Day invalid for all months');
  monthsWith30Days = [4, 6, 9, 11];
  if ( monthsWith30Days.includes(month) && day > 30) throw Error('Day out of range for month');
  else if (month === 2 && day > 28) throw Error('Day out of range for month');
  if (peopleData === null) peopleData = await data.getPeople();
  month = month.toString().padStart(2, '0');
  day = day.toString().padStart(2, '0');
  correctDate = `${month}/${day}`;
  birthdayMatches = new Set();
  peopleData.forEach((p) => {
    if (p['date_of_birth'].startsWith(correctDate))birthdayMatches.add(p);
  });
  if (birthdayMatches.size === 0) throw Error('no people had the same birthday');
  returnArr = [];
  Array.from(birthdayMatches).forEach((p)=>{
    returnArr.push(`${p['first_name']} ${p['last_name']}`);
  });
  console.log(returnArr);
  return returnArr;
}

module.exports = {getPersonById, sameStreet, manipulateSsn, sameBirthday};

// getPersonById('29878298-6a2b-4664-bec0-550c65d666cb');

// sameStreet('Sutherland', 'Point').catch((err)=>{
//   console.log(err);
// });

// manipulateSsn();

// sameBirthday('9', 25).catch((e)=>console.log(e));
