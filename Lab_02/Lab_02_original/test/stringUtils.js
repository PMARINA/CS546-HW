const expect = require('chai').expect;
const stringUtils = require('../stringUtils');

describe('String Utils', function() {
  describe('Sort String', function() {
    describe('validates input', function() {
      it('checks string exists', function() {
        expect(function() {
          stringUtils.sortString();
        }).to.throw('Input was invalid');
      });
      it('checks string is the right type', function() {
        expect(function() {
          stringUtils.sortString(123);
        }).to.throw('type');
        expect(function() {
          stringUtils.sortString(['Hello', 'World']);
        }).to.throw('type');
      });
      it('checks length > 0', function() {
        expect(function() {
          stringUtils.sortString('');
        }).to.throw('empty');
      });
      it('checks the string parameter is not just empty spaces', function() {
        expect(function() {
          stringUtils.sortString('    ');
        }).to.throw('spaces');
      });
    });
    describe('works correctly', function() {
      it('works on the given case', function() {
        expect(stringUtils.sortString('123 FOO BAR!')).to.equal('ABFOOR!123  ');
      });
    });
  });
  describe('Replace Char', function() {
    describe('input validation', function() {
      it('checks for input existing', function() {
        expect(function() {
          stringUtils.replaceChar();
        }).throws('inputs');
        expect(function() {
          stringUtils.replaceChar('test');
        }).throws('inputs');
        expect(function() {
          stringUtils.replaceChar(undefined, 5);
        }).throws('inputs');
        expect(function() {
          stringUtils.replaceChar(undefined);
        }).throws('inputs');
        expect(function() {
          stringUtils.replaceChar(null, 5);
        }).throws('type');
      });
      it('checks for empty string', function() {
        expect(function() {
          stringUtils.replaceChar('', 4);
        }).throws('empty');
      });
      it('checks the inputs are the right type', function() {
        expect(function() {
          stringUtils.replaceChar(123, 'test');
        }).throws('type');
        expect(function() {
          stringUtils.replaceChar('test', 'test');
        }).throws('type');
      });
      it('checks the input isn\'t empty spaces', function() {
        expect(function() {
          stringUtils.replaceChar('        ', 2);
        }).throws('spaces');
      });
      it('checks the idx parameters is valid within the string', function() {
        const testStr = 'testing this function';
        expect(function() {
          stringUtils.replaceChar(testStr, -1);
        }).throws('index');
        expect(function() {
          stringUtils.replaceChar(testStr, 0);
        }).throws('index');
        expect(function() {
          stringUtils.replaceChar(testStr, testStr.length);
        }).throws('index');
        expect(function() {
          stringUtils.replaceChar(testStr, testStr.length-1);
        }).throws('index');
        expect(function() {
          stringUtils.replaceChar('foobar', 0);
        }).throws('index');
      });
    });
    describe('returns the correct answer', function() {
      it('works on the given case', function() {
        expect(stringUtils.replaceChar('Daddy', 2)).equals('Daday');
      });
    });
  });
  describe('Mash Up', function() {
    describe('validates its input', function() {
      it('checks all three parameters exist', function() {
        expect(function() {
          stringUtils.mashUp();
        }).to.throw('Input');
        expect(function() {
          stringUtils.mashUp('test');
        }).to.throw('Input');
        expect(function() {
          stringUtils.mashUp(undefined, 'test');
        }).to.throw('Input');
        expect(function() {
          stringUtils.mashUp('test', undefined, 't');
        }).to.throw('Input');
      });
      it('checks all parameters of correct type', function() {
        expect(function() {
          stringUtils.mashUp('test', 'test', 'test');
        }).to.throw('fill character');
        expect(function() {
          stringUtils.mashUp('test', 5, 't');
        }).to.throw('type');
      });
      it('checks all three are not just empty spaces', function() {
        expect(function() {
          stringUtils.mashUp('test', '   ', 'o');
        }).to.throw('space');
      });
    });
    it('works correctly for the provided input', function() {
      expect(stringUtils.mashUp('Patrick', 'Hill', '$')).to.equal('PHaitlrli$c$k$');
      expect(stringUtils.mashUp('hello', 'world', '#')).to.equal('hweolrllod');
      expect(stringUtils.mashUp('Hi', 'There', '@')).to.equal('HTih@e@r@e');
    });
  });
});
