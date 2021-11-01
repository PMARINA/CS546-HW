const config = require('../config.json');
const axios = require('axios');
const md5 = require('blueimp-md5');


/**
 * Search for a marvel character
 * @param {string} searchTerm The term to search for
 * @return {string[]} The results from the search
 */
async function getResults(searchTerm) {
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
  const url = baseUrl + encodeURI(searchTerm) +
   '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  console.log(url);
  res = (await axios.get(url)).data;
  return res;
}

module.exports = {getResults};
