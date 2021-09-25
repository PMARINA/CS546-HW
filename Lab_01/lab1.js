/**
 * Question 1 from the homework:
 * Compute x^2 - 7
 * Determine if the math.abs of that is prime or not
 * Return an object of |x^2-7| as a key, and a bool as value
 * @param {int[]} arr An array of ints.
 * @return {boolean[]} An array of bools corresponding to whether an integer
 *  derived from the corresponding value in `arr` is prime.
 */
const questionOne = function questionOne(arr) {
  // If empty passed in, return an empty object.
  if (!arr) return {};

  /**
   * Given x and y, compute x^2 - y
   * @param {int} x The first parameter (to be squared)
   * @param {int} y The second parameter (to be subtracted)
   * @return {int} The expression x^2 - y
   */
  function squareSubtractNumber(x, y) {
    return Math.pow(x, 2) - y;
  }

  /**
   * Determine if the provided number is prime.
   * @param {int} x The number to check for cardinality.
   * @return {boolean} Whether the number is prime
   */
  function isPrime(x) {
    const minPrimeNumber = 2;
    for (let i = minPrimeNumber; i < Math.sqrt(x); i++) {
      if (x % i == 0) {
        return false;
      }
    }
    return true;
  }

  // Get the values from |x^2 - 7|
  const returnValues = arr.map((x) => squareSubtractNumber(x, 7)).map(Math.abs);

  // Get if those values are prime
  const returnBooleans = returnValues.map(isPrime);

  // Compile the results into an object
  const returnObj = {};
  for (let i = 0; i < returnValues.length; i++) {
    returnObj[returnValues[i]] = returnBooleans[i];
  }
  return returnObj;
};


/**
 * Return all the unique elements of the arr, discriminating with type & val.
 * @param {(str|int)[]} arr The array on which to operate.
 * @return {(str|int)[]}
 */
const questionTwo = function questionTwo(arr) {
  return Array.from(new Set(arr));
};

/**
 * Find anagrams of strings in the array. Return object with sorted word as key.
 * @param {[str]} arr The list of strings to evaluate
 * @return {{str:str}}
 */
const questionThree = function questionThree(arr) {
  // Return for empty input
  if (!arr) return {};

  // Take care of mixed casing
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].toLowerCase();
  }

  // Take care of nonunique entries
  arr = questionTwo(arr);

  // Break up the problem by length. In retrospect, unnecessary.
  lengthToWordsDict = {};
  arr.forEach((element) => {
    if (!(element.length in lengthToWordsDict)) {
      lengthToWordsDict[element.length] = [element];
    } else {
      lengthToWordsDict[element.length].push(element);
    }
  });

  // The object to return/compile results in
  recognizedAnagrams = {};

  // Go by length, again, unnecessary in retrospect.
  for (const [, val] of Object.entries(lengthToWordsDict)) {
    // If there is more than one word of the same length:
    if (val.length > 1) {
      // Take each word and save it as the letters in alphabetical order.
      wordsAlphabetized = [];
      val.forEach((element) => {
        wordsAlphabetized.push(element.split('').sort().join(''));
      });

      // If we recognize a word, we didn't add the first occurrence,
      // because that would not be an anagram until the second word is found.
      // We store the first occurrence in `firstMatch` for easy access.
      firstMatch = {};
      for (let i = 0; i < wordsAlphabetized.length; i++) {
        // Easy access to the following...
        const currAlphWord = wordsAlphabetized[i];
        const currWord = val[i];

        // If the word was found in firstMatch (we already encountered
        // a word with the same alphabetized characters)
        if (currAlphWord in firstMatch) {
          // If the word was already in the return object
          // (ie don't need to create a new list)
          if (currAlphWord in recognizedAnagrams) {
            recognizedAnagrams[currAlphWord].push(currWord);
          } else {
            // We haven't added it before, so make a new list containing
            // both the first match and the current word and add it to the
            // dictionary to return.
            const listWithBothWords = [firstMatch[currAlphWord], currWord];
            recognizedAnagrams[currAlphWord] = listWithBothWords;
          }
        } else {
          firstMatch[currAlphWord] = currWord;
        }
      }
    }
  }
  return recognizedAnagrams;
};


/**
 * Compute sum(factorial(num) + ...)/avg(nums)
 * Then math.floor
 * @param {int} num1 The first number
 * @param {int} num2 The second number
 * @param {int} num3 The third number
 * @return {int} floor(sum(factorial(all three))/avg(all three))
 */
const questionFour = function questionFour(num1, num2, num3) {
  const nums = [num1, num2, num3];
  // Implement question 4 here

  /**
   * @param {int} x The number to calculate the factorial of
   * @return {int} The factorial of the number.
   */
  function factorial(x) {
    let product = 1;
    for (; x > 1; x--) {
      product *= x;
    }
    return product;
  }

  /**
   * @param {int} x The running total
   * @param {int} y The next value to add to the total
   * @return {int} The updated running total
   */
  function sumOfArrayReducer(x, y) {
    return x + y;
  }
  const avgInputs = nums.reduce(sumOfArrayReducer) / 3;
  const sumFactorials = nums.map(factorial).reduce(sumOfArrayReducer);
  return Math.floor(sumFactorials / avgInputs);
};

// For grading purposes
module.exports = {
  firstName: '***REMOVED***',
  lastName: '***REMOVED***',
  studentId: '***REMOVED***',
  questionOne,
  questionTwo,
  questionThree,
  questionFour,
};
