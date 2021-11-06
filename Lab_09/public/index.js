
const formElement = document.getElementsByTagName('form')[0];
const formBlank = document.getElementById('inputField');
const list = document.getElementById('attempts');
formElement.onsubmit = processSubmit;
let errorStr = undefined;

/**
 * Check if an input is a palindrome
 * @param {string} x The input to check if is a palindrome
 * @return {bool} if x was a palindrome
 */
function isPalindrome(x) {
  for (let i = 0; i< x.length/2; i++) {
    if (x[i] != x[x.length-i-1]) {
      return false;
    }
  }
  return true;
}

/**
 * Return only the alphanumerics in the string
 * @param {string} val The string to parse
 * @return {string} The val with only alphanumerics
 */
function onlyAlphaNumeric(val) {
  nums = [];
  for (let i = 0; i<val.length; i++) {
    const char = val.charCodeAt(i);
    let r = undefined;
    if (char >= 0x30 && char <= 0x39) {
      // numeric
      r = char;
    } else if (char >= 0x41 && char <= 0x5A) {
      // Capital Alpha
      r = char +32;
    } else if (char >= 0x61 && char <= 0x7A) {
      // lowercase alpha
      r = char;
    }
    if (r != undefined) {
      nums.push(r);
    }
  }
  return String.fromCharCode(...nums);
}

/**
 * When inputs are no longer valid, alert the user
 * and do not continue accepting inputs.
 * @param {object} event The form submit event
 */
function errorSubmit(event) {
  formElement.onsubmit = errorSubmit;
  alert(`Error: ${errorStr}\n` +
  'Please refresh the page to restore functionality.');
  event.preventDefault();
  errorStr = '';
}

/**
 *
 * @param {object} event The event to catch
 */
function processSubmit(event) {
  const originalVal = event.target.elements.inputField.value;
  let value = originalVal;
  try {
    if (typeof value !== 'string') throw new Error('Expected a string');
    value = onlyAlphaNumeric(value);
    // value = value.toLowerCase();
    if (value.length <= 0) {
      throw new Error('Query must not be empty or spaces');
    }
    const newLi = document.createElement('li');
    newLi.innerHTML = originalVal;
    if (isPalindrome(value)) {
      console.log(`Yes - ${value}`);
      newLi.className = 'is-palindrome';
    } else {
      console.log(`No - ${value}`);
      newLi.className = 'not-palindrome';
    }
    list.appendChild(newLi);
  } catch (e) {
    errorStr = e.message;
    errorSubmit(event);
    // console.log(e.message);
  }
  formBlank.value = '';
  event.preventDefault();
}
