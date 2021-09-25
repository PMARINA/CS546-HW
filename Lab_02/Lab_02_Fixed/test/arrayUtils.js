const expect = require('chai').expect;
const arrayUtils = require('../arrayUtils');
describe('Array Utils', function() {
  describe('Average Element', function() {
    describe('checks for the parameter existing', function() {
      const expectedError = 'No input was received. Expected an array of arrays.';
      it('catches no input', function() {
        expect(function() {
          arrayUtils.average();
        }).to.throw(expectedError);
      });
      it('catches undefined input', function() {
        expect(function() {
          arrayUtils.average(undefined);
        }).to.throw(expectedError);
      });
      it('catches null input', function() {
        expect(function() {
          arrayUtils.average(null);
        }).to.throw('null');
      });
    });
    describe('checks the parameter is an array', function() {
      const expectedError = 'Input was of the incorrect type. Expected an array of arrays.';
      it('catches string input', function() {
        expect(function() {
          arrayUtils.average('banana');
        }).to.throw(expectedError);
      });
      it('catches Number input', function() {
        expect(function() {
          arrayUtils.average(5);
        }).to.throw(expectedError);
      });
      it('catches boolean input', function() {
        expect(function() {
          arrayUtils.average(true);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.average(false);
        }).to.throw(expectedError);
      });
    });
    it('checks the array is not empty', function() {
      expect(function() {
        arrayUtils.average([]);
      }).to.throw('Input received was empty or contained empty elements.');
    });
    describe('checks that every element of the array is also an array', function() {
      const expectedError = 'Expected an Array, received a/an ';
      it('works for no subarrays', function() {
        expect(function() {
          arrayUtils.average(['guitar', 1, 3, 'apple']);
        }).to.throw(expectedError);
      });
      it('works for some subarrays', function() {
        expect(function() {
          arrayUtils.average([[1, 2, 3], 'Ball']);
        }).to.throw(expectedError);
      });
    });
    describe('checks that each element of the subarray is a Number', function() {
      const expectedError = 'Expected an array of Numbers. Received';
      it('catches a string at the beginning of a subarray', function() {
        expect(function() {
          arrayUtils.average([[1, 3], ['hi', 4, 5]]);
        }).to.throw(expectedError);
      });
      it('catches a string at the end of a subarray', function() {
        expect(function() {
          arrayUtils.average([[1, 2, 3], [2, 4, 'Ball']]);
        }).to.throw(expectedError);
      });
    });

    describe('checks that each subarray is not empty', function() {
      const expectedErroror = 'contained empty elements';
      it('works for one correctly defined, one empty array', function() {
        expect(function() {
          arrayUtils.average([[1, 3], []]);
        }).to.throw(expectedErroror);
      });
      it('works for two correctly defined, one empty array', function() {
        expect(function() {
          arrayUtils.average([[1, 3], [1], []]);
        }).to.throw(expectedErroror);
      });
      it('works for one correctly defined, one empty, one correctly defined array', function() {
        expect(function() {
          arrayUtils.average([[1, 3], [], [1]]);
        }).to.throw(expectedErroror);
      });
    });

    describe('correctly averages the elements', function() {
      it('works for simple subarrays of length 1', function() {
        expect(arrayUtils.average([[1], [2], [3]])).to.equal(2);
      });

      it('works for subarrays of variable length', function() {
        expect(arrayUtils.average([[1, 3], [2, 4, 5]])).to.equal(3);
      });

      it('works for cases that require rounding', function() {
        expect(arrayUtils.average([[4, 1], [3]])).to.equal(3);
      });
    });
  });
  describe('Mode Squared', function() {
    describe('checks for the parameter existing', function() {
      const expectedError = 'No input was received. Expected an Array of Numbers.';

      it('catches no input', function() {
        expect(function() {
          arrayUtils.modeSquared();
        }).to.throw(expectedError);
      });
      it('catches undefined input', function() {
        expect(function() {
          arrayUtils.modeSquared(undefined);
        }).to.throw(expectedError);
      });
      it('catches null input', function() {
        expect(function() {
          arrayUtils.modeSquared(null);
        }).to.throw('null');
      });
    });
    describe('checks that the parameter is an array', function() {
      const expectedError = 'Expected an Array, received a/an';


      it('catches string input', function() {
        expect(function() {
          arrayUtils.modeSquared('banana');
        }).to.throw(expectedError);
      });
      it('catches Number input', function() {
        expect(function() {
          arrayUtils.modeSquared(5);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.modeSquared(1, 2, 3);
        }).to.throw(expectedError);
      });
      it('catches boolean input', function() {
        expect(function() {
          arrayUtils.modeSquared(true);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.modeSquared(false);
        }).to.throw(expectedError);
      });
    });
    it('checks that the array is not empty', function() {
      const expectedError = 'Input received was empty or contained empty elements.';
      expect(function() {
        arrayUtils.modeSquared([]);
      }).to.throw(expectedError);
    });
    describe('checks that each element of the array is a Number', function() {
      const expectedError = 'Expected an array of Numbers. Received element in array with type';
      it('catches string input', function() {
        expect(function() {
          arrayUtils.modeSquared([5, 'banana']);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.modeSquared(['guitar', 1, 3, 'apple']);
        }).to.throw(expectedError);
      });
      it('catches boolean input', function() {
        expect(function() {
          arrayUtils.modeSquared([true, 3, false]);
        }).to.throw(expectedError);
      });
      it('catches array input', function() {
        expect(function() {
          arrayUtils.modeSquared([[2, 3, 4]]);
        }).to.throw(expectedError);
      });
    });
    it('returns the correct answer for a single-mode condition', function() {
      const testInput = [1, 2, 3, 3, 4];
      expect(arrayUtils.modeSquared(testInput)).equals(9);
    });
    it('returns the correct answer for a multi-mode condition', function() {
      const testInput = [1, 2, 3, 3, 4, 4, 5];
      expect(arrayUtils.modeSquared(testInput)).equals(25);
    });
  });
  describe('Median Element', function() {
    describe('checks for the parameter existing', function() {
      const expectedError = 'No input was received. Expected an Array of Numbers.';

      it('catches no input', function() {
        expect(function() {
          arrayUtils.medianElement();
        }).to.throw(expectedError);
      });
      it('catches undefined input', function() {
        expect(function() {
          arrayUtils.medianElement(undefined);
        }).to.throw(expectedError);
      });
      it('catches null input', function() {
        expect(function() {
          arrayUtils.medianElement(null);
        }).to.throw('null');
      });
    });

    describe('checks that the parameter is an array', function() {
      const expectedError = 'Expected an Array, received a/an';


      it('catches string input', function() {
        expect(function() {
          arrayUtils.medianElement('banana');
        }).to.throw(expectedError);
      });
      it('catches Number input', function() {
        expect(function() {
          arrayUtils.medianElement(5);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.medianElement(1, 2, 3);
        }).to.throw(expectedError);
      });
      it('catches boolean input', function() {
        expect(function() {
          arrayUtils.medianElement(true);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.medianElement(false);
        }).to.throw(expectedError);
      });
    });

    it('checks the array is not empty', function() {
      expect(function() {
        arrayUtils.medianElement([]);
      }).to.throw('Input received was empty or contained empty elements.');
    });

    describe('checks that each element of the array is a Number', function() {
      const expectedError = 'Expected an array of Numbers. Received element in array with type';
      it('catches string input', function() {
        expect(function() {
          arrayUtils.medianElement([5, 'banana']);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.medianElement(['guitar', 1, 3, 'apple']);
        }).to.throw(expectedError);
      });
      it('catches boolean input', function() {
        expect(function() {
          arrayUtils.medianElement([true, 3, false]);
        }).to.throw(expectedError);
      });
      it('catches array input', function() {
        expect(function() {
          arrayUtils.medianElement([[2, 3, 4]]);
        }).to.throw(expectedError);
      });
    });

    describe('returns the correct answer', function() {
      it('works for single median cases', function() {
        expect(arrayUtils.medianElement([16, 47, 0])).deep.equals({16: 0});
        expect(arrayUtils.medianElement([2, 4, 6, 8, 9])).deep.equals({6: 2});
        expect(arrayUtils.medianElement([6, 2, 9, 8, 4])).deep.equals({6: 0});
      });
      it('works for multi-median cases', function() {
        expect(arrayUtils.medianElement([3, 4])).deep.equals({3.5: 1});
        expect(arrayUtils.medianElement([5, 2, 9, 6])).deep.equals({5.5: 3});
        expect(arrayUtils.medianElement([6, 2, 9, 6])).deep.equals({6: 0});
      });
    });
  });
  describe('Merge Arrays', function() {
    // spec for merge
    describe('checks for each parameter existing', function() {
      const expectedError = 'No input was received. Expected two Arrays of Numbers/Characters.';

      it('catches no input', function() {
        expect(function() {
          arrayUtils.merge();
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge(undefined);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge(undefined, undefined);
        }).to.throw(expectedError);
      });
      it('catches some input', function() {
        expect(function() {
          arrayUtils.merge(undefined, [1]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([1], undefined);
        }).to.throw(expectedError);
      });
      it('catches null inputs', function() {
        expect(function() {
          arrayUtils.merge(null);
        }).to.throw('null');
        expect(function() {
          arrayUtils.merge(null, [1]);
        }).to.throw('null');
        expect(function() {
          arrayUtils.merge(undefined, null);
        }).to.throw();
        expect(function() {
          arrayUtils.merge(null, undefined);
        }).to.throw('null');
        expect(function() {
          arrayUtils.merge(null, [1]);
        }).to.throw('null');
        expect(function() {
          arrayUtils.merge(null, null);
        }).to.throw('null');
      });
    });

    describe('checks that the parameter is an array', function() {
      const expectedError = 'Expected an Array, received a/an';
      it('catches string input', function() {
        expect(function() {
          arrayUtils.merge('banana', [1]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([1], 'banana');
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge('ba', 'nana');
        }).to.throw(expectedError);
      });
      it('catches Number input', function() {
        expect(function() {
          arrayUtils.merge(5, [6]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge(1, 2, 3);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([6], 5);
        }).to.throw(expectedError);
      });
      it('catches boolean input', function() {
        expect(function() {
          arrayUtils.merge(true, [1]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([1], false);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge(true, false);
        }).to.throw(expectedError);
      });
      it('catches bigint input', function() {
        expect(function() {
          arrayUtils.merge(1n, [1]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([1], 1n);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge(1n, 0n);
        }).to.throw(expectedError);
      });
      it('catches symbol input', function() {
        expect(function() {
          arrayUtils.merge(Symbol('test'), [1]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([1], Symbol('test'));
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge(Symbol('test'), Symbol('test'));
        }).to.throw(expectedError);
      });
    });

    it('checks each array is not empty', function() {
      expect(function() {
        arrayUtils.merge([123], []);
      }).to.throw('Input received was empty or contained empty elements.');
      expect(function() {
        arrayUtils.merge([], ['ab', 'ts']);
      }).to.throw('Input received was empty or contained empty elements.');
    });

    describe('checks that each element of the array is a Number/Char', function() {
      const expectedError = 'Input was of the incorrect type. Expected two Arrays of Numbers/Characters';
      it('catches string input', function() {
        expect(function() {
          arrayUtils.merge([1, 2, 3], [5, 'banana']);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge(['ge'], [1, 2, 3]);
        }).to.throw(expectedError);
        expect(function() {
          expect(arrayUtils.merge([5, '5', 'a'], [2, 3, 'c']));
        }).to.throw(expectedError);
        expect(function() {
          expect(arrayUtils.merge([null, null, null], [null, null, null]));
        }).to.throw(expectedError);
      });
      it('catches boolean input', function() {
        expect(function() {
          arrayUtils.merge([true, 3, false], [45]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([45], [true, 3, false]);
        }).to.throw(expectedError);
      });
      it('catches array input', function() {
        expect(function() {
          arrayUtils.merge([[2, 3, 4]], [2, 3, 4]);
        }).to.throw(expectedError);
        expect(function() {
          arrayUtils.merge([2, 3, 4], [[2, 3, 4]]);
        }).to.throw(expectedError);
      });
    });

    describe('returns the correct answer', function() {
      it('works for Number-only', function() {
        expect(arrayUtils.merge([6, 5, 4], [3, 2, 8])).to.deep.equal([2, 3, 4, 5, 6, 8]);
        expect(arrayUtils.merge([1, 2, 3], [3, 1, 2])).to.deep.equal([1, 1, 2, 2, 3, 3]);
      });

      it('works for char-only', function() {
        expect(arrayUtils.merge(['d', 'c', 'a'], ['b', 'f', 'e'])).to.deep.equal(['a', 'b', 'c', 'd', 'e', 'f']);
      });

      it('works for chars with duplicates', function() {
        expect(arrayUtils.merge(['a', 'b', 'c'], ['a', 'b', 'c'])).to.deep.equal(['a', 'a', 'b', 'b', 'c', 'c']);
      });

      it('works for a mixture of chars and ints', function() {
        expect(arrayUtils.merge(['a'], [2, 5, 3])).to.deep.equal(['a', 2, 3, 5]);
        expect(arrayUtils.merge([1, 2, 3, 'g'], ['d', 'a', 's'])).to.deep.equal(['a', 'd', 'g', 's', 1, 2, 3] );
      });
      it('works for a mixture of lower/uppercase chars and numbers', function() {
        expect(arrayUtils.merge(['A', 'B', 'a'], [1, 2, 'Z'])).to.deep.equal(['a', 'A', 'B', 'Z', 1, 2]);
      });
    });
  });
});
