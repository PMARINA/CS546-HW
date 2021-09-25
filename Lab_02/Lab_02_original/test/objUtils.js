const {expect} = require('chai');
const {flipObject, commonKeys, computeObjects} = require('../objUtils');
objUtils = require('../objUtils');

describe('Object Utils', objectTests);

/**
 * Conduct all tests for object utilities
 */
function objectTests() {
  describe('Compute Objects', computeObjectsTests);
  describe('Common Keys', commonKeysTests);
  describe('Flip Object', flipObjectTests);
}

/**
 * Conduct all tests for computeObjects
 */
function computeObjectsTests() {
  describe('Input Validation', computeObjectsValidation);
  describe('Functionality', computeObjectsTestFunctionality);
}

/**
 * Test if computeObjects works the way it is expected to
 */
function computeObjectsTestFunctionality() {
  it('passes test case 1', function() {
    const first = {x: 2, y: 3};
    const second = {a: 70, x: 4, z: 5};
    const third = {x: 0, y: 9, q: 10};
    const firstSecondThird = computeObjects([first, second], (x) => x * 2);
    expect(firstSecondThird).to.deep.equal({x: 12, y: 6, a: 140, z: 10});
  });
}

/**
 * Test input validation for computeObjects
 */
function computeObjectsValidation() {
  it('checks for no input', noInputTest.bind(undefined, computeObjects));
  it('checks for array passed in', computeObjectsMissingArray);
  it('checks each element of the array is a Number', computeObjectsVerifyArrayContainsNumbers);
  it('checks for the the function passed in', computeObjectsMissingFunction);
}

/**
 * Ensure computeObjects verifies the input only contains numbers
 */
function computeObjectsVerifyArrayContainsNumbers() {
  const f = (x)=>x*2;
  computeObjects([{'a': 1, 'b': 2, 'c': false, 'd': 3}], f);
}

/**
 * Check if computeObjects will catch an input without a function
 */
function computeObjectsMissingFunction() {
  expect(function() {
    computeObjects([1, 2, 3]);
  }).to.throw(/^.*?[mMissing].*/);
}

/**
 * Check if computeObjects will catch the array missing
 */
function computeObjectsMissingArray() {
  expect(function() {
    computeObjects(undefined, (x)=>x*2);
  }).to.throw(/^.*?[eE]mpty.*?$/);
}

/**
 * Assert that the function will fail
 * @param {function} f The function to test
 */
function noInputTest(f) {
  expect(function() {
    f();
  }).to.throw(/^.*?[eE]mpty.*?$/);
}

/**
 * Run all the tests for the common key problem
 */
function commonKeysTests() {
  describe('Input Validation', commonKeysInputValidation);
  describe('Functionality', commonKeysFunctionality);
}

/**
 * Perform input validation testing for commonKeys
 */
function commonKeysInputValidation() {
  it('checks each argument is provided', function() {
    expect(function() {
      commonKeys();
    }).to.throw();
    expect(function() {
      commonKeys({'a': 1}, undefined);
    }).to.throw();
    expect(function() {
      commonKeys(undefined, {'a': 1});
    }).to.throw();
  });
  it('checks that each object is an object', function() {
    expect(function() {
      commonKeys(5, 6);
    }).to.throw();
    expect(function() {
      commonKeys('test', 5);
    });
    expect(function() {
      commonKeys({'a': 5}, true);
    });
  });
  it('gracefully handles the null case', function() {
    expect(function() {
      commonKeys(null, null);
    }).to.throw();
  });
}

/**
 * Perform functionality testing for commonKeys
 */
function commonKeysFunctionality() {
  const first = {a: 2, b: 4};
  const second = {a: 5, b: 4};
  const third = {a: 2, b: {x: 7}};
  const fourth = {a: 3, b: {x: 7, y: 10}};
  it('passes test case 1', function() {
    expect(commonKeys(first, second)).to.deep.equal({'b': 4});
  });
  it('passes test case 2', function() {
    expect(commonKeys(first, third)).to.deep.equal({'a': 2});
  });
  it('passes test case 3', function() {
    expect(commonKeys(second, third)).to.deep.equal({});
  });
  it('passes test case 4', function() {
    expect(commonKeys(third, fourth)).to.deep.equal({'b': {'x': 7}});
  });
  it('passes test case 5', function() {
    expect(commonKeys({}, {})).to.deep.equal({});
  });
}

/**
 * Do testing for flipObject Problem
 */
function flipObjectTests() {
  describe('Input Validation', flipObjectInputValidationTesting);
  describe('Functionality', flipObjectFunctionalityTesting);
}

/**
 * Do Input Validation Testing for flipObject
 */
function flipObjectInputValidationTesting() {
  it('checks for empty inputs', checkAllEmptyInputCombosFlipObjectTesting);
  it('checks for non-object inputs', checkAllNonObjectInputsFlipObjectTesting);
}

/**
 * Check every variation of missing parameter
 */
function checkAllEmptyInputCombosFlipObjectTesting() {
  const expectedError = /[Ii]nput/;
  // no inputs
  expect(function() {
    flipObject();
  }).to.throw(expectedError);
  // one input
  expect(function() {
    flipObject(undefined);
  }).to.throw(expectedError);
}

/**
 * Check testing of non object parameters
 */
function checkAllNonObjectInputsFlipObjectTesting() {
  const expectedError = /(([iI]nput)|([wW]rong))/;
  expect(function() {
    flipObject(5);
  }).to.throw(expectedError);
  expect(function() {
    flipObject('test');
  }).to.throw(expectedError);
  expect(function() {
    flipObject(true);
  }).to.throw(expectedError);
}

/**
 * Test functionality of flipObject Problem
 */
function flipObjectFunctionalityTesting() {
  it('passes test case 1', function() {
    expect(flipObject({a: 3, b: 7, c: 5})).to.deep.equal({'3': 'a', '7': 'b', '5': 'c'});
  });
  it('passes test case 2', function() {
    expect(flipObject({'a': 3, 'b': 7, 'c': {'x': 1}})).to.deep.equal({
      '3': 'a',
      '7': 'b',
      'c': {'1': 'x'},
    });
  });
}
