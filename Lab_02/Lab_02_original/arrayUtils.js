const noInputMessage = 'No input was received.';
const nullErrMessage = 'Input was null.';
const wrongTypeErrMessage = 'Input was of the incorrect type.';
const emptyInputErrMessage = 'Input received was empty or contained empty elements.';

/**
 * Checks if all elements of an array are of an expected type.
 * @param {[[int]]} arr array to check elements of
 * @param {string} validType the type to match to, based on typeof()
 */
function validateArrayElementsOfType(arr, validType) {
  if (arr.length === 0) {
    throw Error(emptyInputErrMessage);
  }

  arr.forEach((el) => {
    if (typeof (el) != validType) {
      throw Error(`Expected an array of Numbers. Received element in array with type ${typeof (el)}`);
    }
  });
}

/**
 * Throws an error if the variable is not an array
 * @param {*} arr The variable to check
 */
function validateVarIsArray(arr) {
  if (!Array.isArray(arr)) throw new Error(`Expected an Array, received a/an ${typeof (arr)}`);
}

/**
 * Validate the inputs to the average function (exported)
 * @param {*} array The parameter to validate
 */
function validateAverageInputs(array) {
  const expectedTypeMessage = 'Expected an array of arrays.';
  if (array === undefined) {
    throw Error(`${noInputMessage} ${expectedTypeMessage}`);
  } else if (array === null) {
    throw Error(`${nullErrMessage} ${expectedTypeMessage}`);
  } else if (!Array.isArray(array)) {
    throw Error(`${wrongTypeErrMessage} ${expectedTypeMessage}`);
  } else if (array.length === 0) {
    throw Error(emptyInputErrMessage);
  }
  array.forEach((el) => {
    validateVarIsArray(el);
    validateArrayElementsOfType(el, 'number');
  });
}

/**
 * Average the elements of a 2d array
 * @param {[[Number]]} array The 2d array
 * @return {Number} The average, rounded
 */
function average(array) {
  validateAverageInputs(array);
  sum = 0;
  count = 0;
  array.forEach((el) => {
    el.forEach((e) => {
      sum += e;
      count += 1;
    });
  });
  return Math.round(sum / count);
}

/**
 * Validate the input to modeSquared
 * @param {*} array The array to validate
 */
function validateArrayOfNumbers(array) {
  const expectedTypeMessage = 'Expected an Array of Numbers.';
  if (array === undefined) {
    throw Error(`${noInputMessage} ${expectedTypeMessage}`);
  }
  if (array === null) {
    throw Error(`${nullErrMessage} ${expectedTypeMessage}}`);
  }
  validateVarIsArray(array);
  if (array.length === 0) throw Error(emptyInputErrMessage);
  validateArrayElementsOfType(array, 'number');
}

/**
 * Computes the square of the mode
 * @param {[Number]} array The array of inputs to check for a mode
 * @return {Number} The square of the mode
 */
function modeSquared(array) {
  validateArrayOfNumbers(array);
  frequencyDict = {};
  array.forEach((element) => {
    if (element in frequencyDict) {
      frequencyDict[element]++;
    } else {
      frequencyDict[element] = 1;
    }
  });
  let maxFrequency = 0;
  let currMode = [];
  for (const [k, v] of Object.entries(frequencyDict)) {
    if (v > maxFrequency) {
      maxFrequency = v;
      currMode = [k];
    } else if (v == maxFrequency) {
      currMode.push(k);
    }
  }
  if (maxFrequency === 1) return 0;
  let sum = 0;
  currMode.forEach((element) => {
    sum += Math.pow(parseInt(element), 2);
  });
  return sum;
}

/**
 * Find the last index of the element. -1 if not found.
 * @param {*} array The array to search
 * @param {*} expectedVal The element to match
 * @return {Number} The index of the element
 */
// function reverseIndexOf(array, expectedVal) {
//   for (let i = array.length - 1; i >= 0; i--) {
//     if (array[i] === expectedVal) {
//       return i;
//     }
//   }
//   return -1;
// }
/**
 * Find the median of a list. Return the average if multiple exist.
 * @param {[Number]} array The list of numbers from which to find a median
 * @return {Number} The median of the list
 */
function medianElement(array) {
  validateArrayOfNumbers(array);
  scratchArray = [...array];
  scratchArray.sort();
  let medianIndex = -1;
  let median = -1;
  if (scratchArray.length % 2 === 1) {
    // odd case
    medianIndex = Math.floor(scratchArray.length / 2);
    median = scratchArray[medianIndex];

    medianIndex = array.indexOf(median);
  } else {
    // even case
    medianIndex = scratchArray.length / 2;
    const arr = [scratchArray[medianIndex - 1], scratchArray[medianIndex]];
    median = arr[0] + arr[1];
    median /= 2;
    medianIndex = array.indexOf(scratchArray[medianIndex]);
  }
  const returnObj = {};
  returnObj[median] = medianIndex;
  return returnObj;
}

/**
 * Verify if both inputs to merge are valid
 * @param {*} arrayA The first input
 * @param {*} arrayB The second input
 */
function validateMergeInputs(arrayA, arrayB) {
  /**
   * Determine if the character is a valid letter of the alphabet
   * @param {string} ch the character
   * @return {boolean} if the character is an alphabet
   */
  function validateAsciiRange(ch) {
    chCode = ch.charCodeAt(0);
    if (chCode >= 65 && chCode <= 90) return true;
    if (chCode >= 97 && chCode <= 122) return true;
    return false;
  }

  /**
   * Verify if each array is valid (don't duplicate code)
   * @param {*} arr The array to verify
   */
  function validateSingleArray(arr) {
    if (arr === undefined) {
      throw Error('No input was received. Expected two Arrays of Numbers/Characters.');
    }
    if (arr === null) {
      throw Error(nullErrMessage);
    }
    validateVarIsArray(arr);
    if (arr.length === 0) {
      throw Error(emptyInputErrMessage);
    }
    arr.forEach((el) => {
      if (typeof (el) == 'number') return;
      if (typeof (el) == 'string' && el.length === 1 && validateAsciiRange(el)) return;
      throw Error(`${wrongTypeErrMessage} Expected two Arrays of Numbers/Characters`);
    });
  }
  validateSingleArray(arrayA);
  validateSingleArray(arrayB);
}
/**
 * Return the merged version of both arrays, sorted alphabetically, then numerically
 * @param {[Number, char]} arrayA The first array
 * @param {[Number, char]} arrayB The second array
 * @return {[Number, char]} The merged array
 */
function merge(arrayA, arrayB) {
  validateMergeInputs(arrayA, arrayB);
  const combined = [...arrayA, ...arrayB];
  const upperChars = [];
  const lowerChars = [];
  const nums = [];
  combined.forEach((element) => {
    if (typeof (element) === 'number') {
      nums.push(element);
    } else {
      const asciiValue = element.charCodeAt(0);
      if (asciiValue >= 97) {
        // lowercase
        lowerChars.push(element);
      } else {
        upperChars.push(element);
      }
    }
  });
  upperChars.sort();
  lowerChars.sort();
  nums.sort();
  return [...lowerChars, ...upperChars, ...nums];
}
module.exports = {average, modeSquared, medianElement, merge};
