({average, modeSquared, medianElement, merge} = require('./arrayUtils'));
({sortString, replaceChar, mashUp} = require('./stringUtils'));
({computeObjects, commonKeys, flipObject} = require('./objUtils'));

/**
 * Run a test and catch any errors. Print if anything unexpected happens.
 * @param {string} testName The name of the function being tested
 * @param {boolean} shouldErr Should the test fail?
 * @param {function} f A function that runs the test and returns the output
 * @param {*} expectedOutput The expected output of the test
 */
function test(testName, shouldErr, f, expectedOutput) {
  try {
    if (typeof (expectedOutput) === 'object') {
      /**
       * Compare two objects
       * @param {object} o1
       * @param {object} o2
       * @return {boolean} If the objects are the same from a k,v point of view
       */
      function verifyObject(o1, o2) {
        if (o1 === null || o2 === null) return false;
        for (const [k, v] of Object.entries(o1)) {
          if (!k in o2) return false;
          if (typeof (v) != typeof (o2[k])) return false;
          if (typeof (v) === 'object') {
            if (!verifyObject(v, o2[k])) return false;
          } else {
            if (v != o2[k]) return false;
          }
        }
        return true;
      }
      const result = f();
      if (!verifyObject(expectedOutput, result) || !verifyObject(result, expectedOutput)) {
        console.log(`Wrong output: ${f()} received instead of ${expectedOutput}`);
      }
    } else {
      if (f() != expectedOutput) {
        console.log(`Wrong output: ${f()} received instead of ${expectedOutput}`);
      }
    }
    console.log(`${testName} ${shouldErr ? 'did not error' : 'passed successfully'}`);
    if (shouldErr) console.log(f());
  } catch (e) {
    console.log(`${testName} ${shouldErr ? 'failed successfully' : 'failed test case'}`);
    if (!shouldErr) console.log(e);
  }
}

test('Average', true, () => {
  return average([['alphabet', 's'], [0], ['up']]);
});
test('Average', false, () => {
  return average([[1], [3, 2, 5]]);
}, 3);
console.log('\n');

test('Mode Squared', true, () => {
  return modeSquared([1, 4, 4, 9, 2, 'apple']);
}, -1);
test('Mode Squared', false, () => {
  return modeSquared([1, 4, 4, 9, 2]);
}, 16);
test('Mode Squared', false, () => {
  return modeSquared([3, 1, 4, 4, 9, 2, 3]);
}, 25);
console.log('\n');

test('Median Element', true, () => {
  return medianElement([1, 2, '5', 6]);
});
test('Median Element', false, () => {
  return medianElement([1, 3, 6]);
}, {'3': 1});
console.log('\n');

test('Merge', true, () => {
  return merge([1, 3, 5], [2, 5, false]);
});
test('Merge', true, () => {
  return merge([1, 3, 5], [2, 5, 'false']);
});
test('Merge', false, () => {
  return merge([1, 'A'], [2, 'a']);
}, ['a', 'A', 1, 2]);
console.log('\n');

test('Sort String', true, ()=>{
  return sortString(123);
});
test('Sort String', false, () => {
  return sortString('Baa baa black sheep have y0u any wool?');
}, 'aaaaaaabbceeehhkllnoopsuvwyyB?0       ');
console.log('\n');

test('Replace Char', true, ()=>{
  return replaceChar('Dadadad123', 9);
});
test('Replace Char', false, ()=>{
  return replaceChar('Dadadad123', 1);
}, 'DadDddd123');
console.log('\n');

test('Mash Up', true, ()=>{
  mashUp('astrazeneca', 'may be able', 'to help');
});
test('Mash Up', true, ()=>{
  mashUp('                   ', 'may be able', 'to help');
});
test('Mash Up', false, ()=>{
  return mashUp('astrazeneca', 'may be able', '2');
}, 'amsatyr abzee naebclae');
test('Mash Up', false, ()=>{
  return mashUp('astrazeneca', 'may be able to help', '2');
}, 'amsatyr abzee naebclae2 2t2o2 2h2e2l2p');
console.log('\n');

test('Compute Objects', true, ()=>{
  return computeObjects([{'a': 2, 'b': 3}, {'b': 'ball'}], (x)=>{
    return x-1;
  });
}, {'a': 1, 'b': 5});
test('Compute Objects', false, ()=>{
  return computeObjects([{'a': 2, 'b': 3}, {'b': 4}], (x)=>{
    return x-1;
  });
}, {'a': 1, 'b': 5});
console.log('\n');

test('Common Keys', true, ()=>{
  return commonKeys({'a': 2}, null);
}, {});
test('Common Keys', false, ()=>{
  return commonKeys({'a': 2}, {'b': 3, 'a': 5});
}, {});
console.log('\n');

test('Flip Object', true, ()=>{
  return flipObject({'a': null});
});
test('Flip Object', false, ()=>{
  return flipObject({'a': 5, 'c': 'e', 'golf': {'is': 'not', 'my': 'favorite', 'sport': '!'}});
}, {'5': 'a', 'e': 'c', 'golf': {'not': 'is', 'favorite': 'my', '!': 'sport'}});
console.log('\n');
