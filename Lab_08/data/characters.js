const config = require('../config.json');
const axios = require('axios');
const md5 = require('blueimp-md5');


/**
 * Search for a marvel character
 * @param {string} id The character's ID
 * @return {string[]} The results from the search
 */
async function getCharacter(id) {
  if (typeof id !== 'string' || isNaN(id.trim())) {
    throw new Error('Expected id to be a number');
  }
  id = id.trim();
  const idNumber = parseInt(id);
  if (isNaN(idNumber)) {
    throw new Error('Expected id to not be NaN');
  }
  const ts = new Date().getTime();
  const publickey = config.MARVEL.PUBKEY;
  const privatekey = config.MARVEL.PRIVKEY;
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters/';
  const url = baseUrl + id +
    '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  let res = undefined;
  console.log(url);
  try {
    res = (await axios.get(url)).data;
  } catch (e) {
    return {code: 404, msg: e.msg};
  }
  //   console.log(res);
  return res;
}

module.exports = {getCharacter};
