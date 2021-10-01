/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

const restaurants = require('./restaurants');
const db = require('./mongoConnection');

async function addPierce() {
  const pierce = await restaurants.create('Pierce Dining Hall', 'Top of campus, Stevens Institute of Technology', '201-216-5128', 'https://www.stevensdining.com', '$$$', ['Asian', 'Grilled', 'Ice cream', 'Cereal'], 2, {'dineIn': true, 'takeOut': false, 'delivery': false});
  return pierce;
}

async function addMcDonalds() {
  const mcdonalds = await restaurants.create('McDonalds of Hoboken', 'Like 2nd street and Wash, Hoboken', '201-798-2078', 'https://www.mcdonalds.com', '$', ['Deep fry', 'Burger', 'Fries', 'Milkshake'], 3, {'dineIn': true, 'takeOut': true, 'delivery': false});
  return mcdonalds;
}

async function addCostco() {
  const costco = await restaurants.create('Costco of Bayonne', 'Bayonne, NJ', '201-354-2335', 'https://www.costco.com', '$', ['Pizza', 'Hot Dogs'], 4, {'dineIn': true, 'delivery': false, 'takeOut': true});
  return costco;
}

async function getAll() {
  const allRestaurants = await restaurants.getAll();
  console.log(allRestaurants);
}

async function getOne(id) {
  const returnedRestaurant = await restaurants.get(id);
  console.log(returnedRestaurant);
}

async function remove(id) {
  const returnedString = await restaurants.remove(id);
  // console.log(returnedString);
}

async function rename(id) {
  const returnedObject = await restaurants.rename(id, 'http://www.pierceAtStevens.wixsite.com');
  console.log(returnedObject);
}
(async () => {
  try {
    // 1
    let pierce = undefined;
    let mcdonalds = undefined;
    let costco = undefined;
    try {
      pierce = await addPierce();
    } catch (e) {
      console.log(`1 failed with ${e}`);
    }
    // 2
    try {
      getOne(pierce._id);
    } catch (e) {
      console.log(`2 failed with ${e}`);
    }
    // 3
    try {
      mcdonalds = await addMcDonalds();
    } catch (e) {
      console.log(`3 failed with ${e}`);
    }
    // 4
    try {
      getAll();
    } catch (e) {
      console.log(`4 failed with ${e}`);
    }
    // 5
    try {
      costco = await addCostco();
    } catch (e) {
      console.log(`5 failed with ${e}`);
    }
    // 6
    try {
      await getOne(costco._id);
    } catch (e) {
      console.log(`6 failed with ${e}`);
    }
    // 7 + 8
    try {
      await rename(pierce._id);
    } catch (e) {
      console.log(`7 & 8 failed with ${e}`);
    }
    // rip 9
    try {
      await remove(mcdonalds._id);
    } catch (e) {
      console.log(`9 failed with ${e}`);
    }
    // 10
    try {
      await getAll();
    } catch (e) {
      console.log(`10 failed with ${e}`);
    }
    // 11
    try {
      await restaurants.create('a name', 'location, of world', '123-456-7890', 'https://www.google.com', '$', ['testCuisine'], 2, null);
      console.log('11 failed');
    } catch (e) {
      console.log('11 passed');
    }
    // 12
    try {
      await remove('ffffffffffffffffffffffff'); console.log('12 failed');
    } catch (e) {
      console.log('12 passed');
    }
    // 13
    try {
      await restaurants.rename('ffffffffffffffffffffffff');
      console.log('13 failed');
    } catch (e) {
      console.log('13 passed');
    }
    // 14
    try {
      await restaurants.rename('0xffffffffffffffffffffffff');
      console.log('14 failed');
    } catch (e) {
      console.log('14 passed');
    }
    // 15
    try {
      await restaurants.get('ffffffffffffffffffffffff');
      console.log('15 failed');
    } catch (e) {
      console.log('15 passed');
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  } finally {
    const client = await db.getClient();
    await client.close();
    process.exit();
  }
})();
