const config = require('../config.json');
const axios = require('axios');
const md5 = require('blueimp-md5');


/**
 * Search for a marvel character
 * @param {string} searchTerm The term to search for
 * @return {string[]} The results from the search
 */
async function getResults(searchTerm) {
  if (typeof searchTerm != 'string') {
    throw new Error('Expected String for SearchTerm');
  }
  const ts = new Date().getTime();
  const publickey = config.MARVEL.PUBKEY;
  const privatekey = config.MARVEL.PRIVKEY;
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=';
  const url = baseUrl + encodeURI(searchTerm) +
   '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  res = (await axios.get(url)).data;
  //   console.log(res);
  if (res.code !== 200) {
    throw new Error(`API call returned error code: ${res.code}`);
  }
  return res;
}

module.exports = {getResults};
