
/**
 * Validate if the string provided matches requirements for sortString
 * @param {string} str the string to validate
 */
 function validateSortStringInput(str) {
  if (str === undefined || str === null) {
    throw Error('Input was invalid/empty/undefined/null');
  }
  if (typeof(str) != 'string') {
    throw Error('Wrong type supplied. Expected a string.');
  }
  if (str.length === 0) throw Error('Input string was empty.');
  stringSpaceCheck(str);
}
/**
 * Check if the string is all spaces.
 * @param {string} str The string to check
 */
function stringSpaceCheck(str) {
  let stringOnlyHasSpaces = true;
  for (let i = 0; i<str.length; i++) {
    if (str.charAt(i) != ' ') {
      stringOnlyHasSpaces = false;
      break;
    }
  }
  if (stringOnlyHasSpaces) throw Error('String should not just have spaces');
}

/**
 * Check if the character is uppercase
 * @param {string} c a string
 * @return {boolean} if the character is uppercase
 */
function isUpperCase(c) {
  char = c.charCodeAt(0);
  return char >= 65 && char <= 90;
}

/**
 * Check if the character is lowercase
 * @param {string} c a string
 * @return {boolean} if the character is lowercase
 */
function isLowerCase(c) {
  char = c.charCodeAt(0);
  return char >= 97 && char <= 122;
}
/**
 * Check if the character is a number
 * @param {string} c a string
 * @return {boolean} if the character is a number
 */
function isNumber(c) {
  char = c.charCodeAt(0);
  return char >= 48 && char <= 57;
}

/**
 * Check if the character is a space
 * @param {string} c a string
 * @return {boolean} if the character is a space
 */
function isSpace(c) {
  char = c.charCodeAt(0);
  return char === 32;
}

/**
 * Check if the character is a symbol
 * @param {string} c a string
 * @return {boolean} if the character is a symbol
 */
function isSymbol(c) {
  char = c.charCodeAt(0);
  return !(isLowerCase(c) || isUpperCase(c) || isNumber(c) || isSpace(c));
}

/**
 * Sort a string by upper, lower, special, numbers, spaces.
 * @param {string} str the string to sort
 * @return {string} the sorted string
 */
function sortString(str) {
  validateSortStringInput(str);
  const uppers = [];
  const lowers = [];
  const symbols = [];
  const digits = [];
  let numSpaces = 0;
  str.split('').forEach((c) => {
    if (isUpperCase(c)) {
      uppers.push(c);
    } else if (isLowerCase(c)) {
      lowers.push(c);
    } else if (isSymbol(c)) {
      symbols.push(c);
    } else if (isNumber(c)) {
      digits.push(c);
    } else if (isSpace(c)) {
      numSpaces += 1;
    }
  });
  lowers.sort();
  uppers.sort();
  symbols.sort();
  digits.sort();
  const chars = [...lowers, ...uppers, ...symbols, ...digits];
  for (let i = 0; i<numSpaces; i++) {
    chars.push(' ');
  }
  return chars.join('');
}

/**
 * Validate inputs before running function replaceChar.
 * @param {string} s The string to validate
 * @param {Number} i The number to validate
 */
function validateReplaceChar(s, i) {
  if (s === undefined || i === undefined) {
    throw Error('Not all inputs given');
  }
  if (typeof(s) != 'string' || typeof(i) != 'number' || isNaN(i)) {
    throw Error('Inputs of incorrect type');
  }
  if (s.length === 0) {
    throw Error('String was empty');
  }
  stringSpaceCheck(s);
  if (i <= 0 || i >= s.length - 1) {
    throw Error('Invalid index specified');
  }
}

/**
 * Replace all characters except at index i, in a weird way.
 * @param {string} s The string to process
 * @param {Number} i The index of the char to replace
 * @return {string} a string with the operation applied
 */
function replaceChar(s, i) {
  validateReplaceChar(s, i);
  const charToReplace = s.charAt(i);
  const replacementChars = [s.charAt(i-1), s.charAt(i+1)];
  let currentReplacementIndex = 0;
  for (let j = 0; j<s.length; j++) {
    if (j == i) continue;
    if (s.charAt(j) === charToReplace) {
      s = s.substr(0, j) + replacementChars[currentReplacementIndex] + s.substr(j+1, s.length-j-1);
      currentReplacementIndex++;
      if (currentReplacementIndex >= replacementChars.length) currentReplacementIndex = 0;
    }
  }
  return s;
}

/**
 * Validate the inputs to mashUp
 * @param {string} s1 String 1
 * @param {string} s2 String 2
 * @param {string} p Fill Character
 */
function validateMashUp(s1, s2, p) {
  validateSortStringInput(s1);
  validateSortStringInput(s2);
  if (p === null) throw Error('Fill character is null');
  if (typeof(p) != 'string') throw Error('Fill character not a string');
  if (p.length === 0) throw Error('Empty fill character provided');
  if (p.length != 1) throw Error('More than 1 fill character provided.');
}


/**
 * Interleave the two strings, padding as necessary
 * @param {string} s1 The first string
 * @param {string} s2 The second string
 * @param {string} p The character to pad with
 * @return {string} the result of the operation
 */
function mashUp(s1, s2, p) {
  validateMashUp(s1, s2, p);
  let currentIndex = 0;
  const maxLen = Math.max(s1.length, s2.length);
  let retStr = '';

  /**
   * Get character at position or padding character
   * @param {string} s The string
   * @param {number} i The index of the char in the string
   * @return {string} The char at the position in the string or the padding character
   */
  function getChar(s, i) {
    if (i < s.length) return s.charAt(i);
    return p;
  }
  while (currentIndex< maxLen) {
    retStr += getChar(s1, currentIndex) + getChar(s2, currentIndex);
    currentIndex++;
  }
  return retStr;
}

module.exports = {sortString, replaceChar, mashUp};
