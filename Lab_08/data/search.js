const config = require('../config.json');
const axios = require('axios');
const md5 = require('blueimp-md5');


/**
 * Search for a marvel character
 * @param {string} searchTerm The term to search for
 * @param {[Number]} LIMIT_TO The number of results to limit to
 * @return {object[]|string} The results from the search
 */
async function getResults(searchTerm, LIMIT_TO = 20) {
  if (typeof searchTerm != 'string' || searchTerm.trim().length <= 0) {
    throw new Error('Expected nonempty string for searchTerm');
  }
  searchTerm = searchTerm.trim();
  const ts = new Date().getTime();
  const publickey = config.MARVEL.PUBKEY;
  const privatekey = config.MARVEL.PRIVKEY;
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=';
  const url = baseUrl + encodeURI(searchTerm) + `&limit=${LIMIT_TO}` +
    '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  console.log(url);
  try {
    res = (await axios.get(url)).data;
  } catch (e) {
    return e.message;
  }
  return res;
}

module.exports = {getResults};
