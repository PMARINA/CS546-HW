const expect = require('chai').expect;
const validate = require('../data/validate');
const mdb = require('mongodb');
describe('Validation Functions', function() {
  describe('Check Type', function() {
    it('Checks array input', function() {
      expect(function() {
        validate.checkType('Test parameter', 'stringparam', ['string']);
      }).to.not.throw();
    });
    it('Converts a single parameter to an array', function() {
      expect(function() {
        validate.checkType('Test parameter', 'stringparam', ['string']);
      }).to.not.throw();
    });
    it('Works for multiple parameters in the array', function() {
      expect(function() {
        validate.checkType('Test parameter', 'stringparam',
            ['string', 'number']);
        validate.checkType('Test parameter', 5, ['string', 'number']);
      }).to.not.throw();
    });
    it('Throws for invalid single-input', function() {
      expect(function() {
        validate.checkType('Test parameter', true, 'string');
      }).to.throw(/^Test parameter.*?$/);
    });
    it('Throws for invalid multi-input', function() {
      expect(function() {
        validate.checkType('Test parameter', true,
            ['string', 'symbol', 'object']);
      }).to.throw(/^Test parameter.*?$/);
    });
    it('Throws for undefined', function() {
      expect(function() {
        validate.checkType('Test parameter', undefined,
            ['string', 'symbol', 'object']);
      }).to.throw(/^Test parameter.*?$/);
    });
  });

  describe('Check not empty spaces', function() {
    it('Works on empty strings', function() {
      expect(function() {
        validate.checkNotEmptySpaces('Test parameter', '');
      }).to.throw(/^Test parameter.*?$/);
    });
    it('Works on spacey strings', function() {
      expect(function() {
        validate.checkNotEmptySpaces('Test parameter', ' ');
      }).to.throw(/^Test parameter.*?$/);
      expect(function() {
        validate.checkNotEmptySpaces('Test parameter', '    ');
      }).to.throw(/^Test parameter.*?$/);
      expect(function() {
        validate.checkNotEmptySpaces('Test parameter', '\t\t\t ');
      }).to.throw(/^Test parameter.*?$/);
    });
  });

  describe('Validate Name', function() {
    it('Checks for no input', function() {
      expect(function() {
        validate.validateName();
      }).to.throw(/^Name.*?$/);
    });
    it('Checks for nonstrings', function() {
      expect(function() {
        validate.validateName(true);
      }).to.throw(/^Name.*?$/);
      expect(function() {
        validate.validateName(5);
      }).to.throw(/^Name.*?$/);
      expect(function() {
        validate.validateName({});
      }).to.throw(/^Name.*?$/); ;
    });
    it('Checks for empty strings', function() {
      expect(function() {
        validate.validateName('');
      }).to.throw(/^Name.*?$/);
    });
    it('Works when a string is passed', function() {
      expect(function() {
        validate.validateName('testParameter');
      }).to.not.throw();
    });
  });

  describe('Validate Location', function() {
    it('Checks for no input', function() {
      expect(function() {
        validate.validateLocation();
      }).to.throw(/^Location.*?$/);
    });
    it('Checks for nonstrings', function() {
      expect(function() {
        validate.validateLocation(true);
      }).to.throw(/^Location.*?$/);
      expect(function() {
        validate.validateLocation(5);
      }).to.throw(/^Location.*?$/);
      expect(function() {
        validate.validateLocation({});
      }).to.throw(/^Location.*?$/); ;
    });
    it('Checks for empty strings', function() {
      expect(function() {
        validate.validateLocation('');
      }).to.throw(/^Location.*?$/);
    });
    it('Checks for incorrect inputs', function() {
      expect(function() {
        validate.validateLocation('wrong format');
      }).to.throw(/^Location.*?$/);
      expect(function() {
        validate.validateLocation('wrong format,');
      }).to.throw(/^Location.*?$/);
      expect(function() {
        validate.validateLocation(', wrong');
      }).to.throw(/^Location.*?$/);
    });
    it('Works when a string is passed', function() {
      expect(function() {
        validate.validateName('new york, new york');
      }).to.not.throw();
    });
  });

  describe('Validate Phone Number', function() {
    it('Checks for no input', function() {
      expect(function() {
        validate.validatePhoneNumber();
      }).to.throw(/^Phone.*?$/);
    });
    it('Checks for nonstrings', function() {
      expect(function() {
        validate.validatePhoneNumber(true);
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber(5);
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber({});
      }).to.throw(/^Phone.*?$/); ;
    });
    it('Checks for empty strings', function() {
      expect(function() {
        validate.validatePhoneNumber('');
      }).to.throw(/^Phone.*?$/);
    });
    it('Checks for badly formatted numbers', function() {
      expect(function() {
        validate.validatePhoneNumber('1234567890');
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber('123 456 7890');
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber('(123) 456 7890');
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber('(123)4567890');
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber('(123) 456-7890');
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber('123-456-78900');
      }).to.throw(/^Phone.*?$/);
      expect(function() {
        validate.validatePhoneNumber('+1-123-456-7890');
      }).to.throw(/^Phone.*?$/);
    });
    it('Works for a correctly formatted number', function() {
      expect(function() {
        validate.validatePhoneNumber('123-456-7890');
      }).to.not.throw();
      expect(function() {
        validate.validatePhoneNumber('453-342-4593');
      }).to.not.throw();
    });
  });

  describe('Validate Website', () => {
    it('Checks if input is given', () => {
      expect(() => {
        validate.validateWebsite();
      }).to.throw(/Website/);
    });
    it('Checks for empty strings', () => {
      expect(() => {
        validate.validateWebsite('');
      }).to.throw(/Website/);
    });
    it('Checks for nonstrings', function() {
      expect(function() {
        validate.validateWebsite(true);
      }).to.throw(/^Website.*?$/);
      expect(function() {
        validate.validateWebsite(5);
      }).to.throw(/^Website.*?$/);
      expect(function() {
        validate.validateWebsite({});
      }).to.throw(/^Website.*?$/); ;
    });
    it('Catches invalid websites', function() {
      // no http
      expect(function() {
        validate.validateWebsite('google.com');
      }).to.throw(/^Website.*?$/);
      // no www
      expect(function() {
        validate.validateWebsite('http://google.com');
      }).to.throw(/^Website.*?$/);
      // no .com
      expect(function() {
        validate.validateWebsite('http://www.google');
      }).to.throw(/^Website.*?$/);
      // 4 letters only
      expect(function() {
        validate.validateWebsite('http://www.web.com');
      }).to.throw(/^Website.*?$/);
      // Stuff after .com
      expect(function() {
        validate.validateWebsite('http://www.google.com/menu');
      }).to.throw(/^Website.*?$/);
    });
    it('Works for the correct inputs', () => {
      expect(function() {
        validate.validateWebsite('http://www.saffronlounge.com');
      }).to.not.throw();
      expect(function() {
        validate.validateWebsite('http://www.blackbear.com');
      }).to.not.throw();
      expect(function() {
        validate.validateWebsite('http://www.pizzalounge.com');
      }).to.not.throw();
      expect(function() {
        validate.validateWebsite('http://www.thesaffronlounge.com');
      }).to.not.throw();
      expect(function() {
        validate.validateWebsite('http://www.google.com');
      }).to.not.throw();
    });
  });

  describe('Validate Price Range', () => {
    it('Checks for no input', function() {
      expect(function() {
        validate.validatePriceRange();
      }).to.throw(/^Price.*?$/);
    });
    it('Checks for nonstrings', function() {
      expect(function() {
        validate.validatePriceRange(true);
      }).to.throw(/^Price.*?$/);
      expect(function() {
        validate.validatePriceRange(5);
      }).to.throw(/^Price.*?$/);
      expect(function() {
        validate.validatePriceRange({});
      }).to.throw(/^Price.*?$/); ;
    });
    it('Checks for empty strings', function() {
      expect(function() {
        validate.validatePriceRange('');
      }).to.throw(/^Invalid price.*?$/);
    });
    it('Checks for invalid prices', function() {
      expect(function() {
        validate.validatePriceRange('$12');
      }).to.throw(/^Invalid price.*?$/);
      expect(function() {
        validate.validatePriceRange('expensive');
      }).to.throw(/^Invalid price.*?$/);
      expect(function() {
        validate.validatePriceRange('e');
      }).to.throw(/^Invalid price.*?$/);
      expect(function() {
        validate.validatePriceRange('3');
      }).to.throw(/^Invalid price.*?$/);
    });
    it('Works for valid prices', function() {
      expect(function() {
        validate.validatePriceRange('$');
      }).to.not.throw();
      expect(function() {
        validate.validatePriceRange('$$');
      }).to.not.throw();
      expect(function() {
        validate.validatePriceRange('$$$');
      }).to.not.throw();
      expect(function() {
        validate.validatePriceRange('$$$$');
      }).to.not.throw();
    });
  });

  describe('Validate Cuisines', () => {
    it('Checks for no input', function() {
      expect(function() {
        validate.validateCuisines();
      }).to.throw(/^Cuisine.*?$/);
    });

    it('Checks for not an array', function() {
      expect(function() {
        validate.validateCuisines({});
      }).to.throw(/^Cuisine.*?$/);
      expect(function() {
        validate.validateCuisines(true);
      }).to.throw(/^Cuisine.*?$/);
      expect(function() {
        validate.validateCuisines('test');
      }).to.throw(/^Cuisine.*?$/);
      expect(function() {
        validate.validateCuisines(null);
      }).to.throw(/^Cuisine.*?$/);
    });
    it('Checks for an empty array', () => {
      expect(() => validate.validateCuisines([])).to.throw(/Cuisine/);
    });
    it('Checks for empty strings', () => {
      expect(() => {
        validate.validateCuisines(['']);
      }).to.throw(/Item of cuisines/);
      expect(() => {
        validate.validateCuisines(['valid', '']);
      }).to.throw(/Item of cuisines/);
    });
    it('Works for the expected cases', () => {
      expect(() => {
        validate.validateCuisines(['Cuban', 'Italian']);
      }).to.not.throw();
      expect(() => {
        validate.validateCuisines(['Cuban', 'American']);
      }).to.not.throw();
      expect(() => {
        validate.validateCuisines(['Italian']);
      }).to.not.throw();
    });
  });

  describe('Validate Overall Rating', () => {
    it('Throws for no input', () => {
      expect(() => {
        validate.validateOverallRating();
      }).to.throw(/Overall/);
    });
    it('Throws for input of the wrong type', () => {
      expect(() => {
        validate.validateOverallRating('');
      }).to.throw(/Overall/);
      expect(() => {
        validate.validateOverallRating(true);
      }).to.throw(/Overall/);
      expect(() => {
        validate.validateOverallRating({});
      }).to.throw(/Overall/);
    });
    it('Throws for input out of range', () => {
      expect(() => {
        validate.validateOverallRating(-1);
      }).to.throw(/Overall/);
      expect(() => {
        validate.validateOverallRating(6);
      }).to.throw(/Overall/);
      expect(() => {
        validate.validateOverallRating(10);
      }).to.throw(/Overall/);
    });
    it('Works for the expected input', () => {
      expect(() => {
        validate.validateOverallRating(0);
      }).to.not.throw();
      expect(() => {
        validate.validateOverallRating(1);
      }).to.not.throw();
      expect(() => {
        validate.validateOverallRating(2);
      }).to.not.throw();
      expect(() => {
        validate.validateOverallRating(3);
      }).to.not.throw();
      expect(() => {
        validate.validateOverallRating(4);
      }).to.not.throw();
      expect(() => {
        validate.validateOverallRating(5);
      }).to.not.throw();
    });
  });

  describe('Validate Service Options', () => {
    it('Checks for no input', () => {
      expect(() => validate.validateServiceOptions()).to.throw('Service');
    });
    it('Checks for nonstring inputs', () => {
      expect(() => {
        validate.validateServiceOptions(1);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        validate.validateServiceOptions('Service');
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        validate.validateServiceOptions(true);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        validate.validateServiceOptions([]);
      }).to.throw(/[Ss]ervice/);
    });
    it('Checks for invalid inner inputs', () => {
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = true;
        inputToSend.takeOut = false;
        inputToSend.delivery = 5;
        validate.validateServiceOptions(inputToSend);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = true;
        inputToSend.takeOut = false;
        inputToSend.delivery = true;
        inputToSend.DiGiorno = true;
        validate.validateServiceOptions(inputToSend);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = true;
        inputToSend.takeOut = false;
        validate.validateServiceOptions(inputToSend);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = 5;
        inputToSend.takeOut = false;
        inputToSend.delivery = true;
        validate.validateServiceOptions(inputToSend);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = true;
        inputToSend.takeOut = 5;
        inputToSend.delivery = true;
        validate.validateServiceOptions(inputToSend);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = 'true';
        inputToSend.takeOut = 'false';
        inputToSend.delivery = 'true';
        validate.validateServiceOptions(inputToSend);
      }).to.throw(/[Ss]ervice/);
      expect(() => {
        const inputToSend = {};
        // inputToSend.dineIn = 'true'
        inputToSend.takeOut = false;
        inputToSend.delivery = true;
        validate.validateServiceOptions(inputToSend);
      }).to.throw(/[Ss]ervice/);
    });
    it('Works for the expected inputs', () => {
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = true;
        inputToSend.takeOut = false;
        inputToSend.delivery = true;
        validate.validateServiceOptions(inputToSend);
      }).to.not.throw();
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = false;
        inputToSend.takeOut = false;
        inputToSend.delivery = true;
        validate.validateServiceOptions(inputToSend);
      }).to.not.throw();
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = true;
        inputToSend.takeOut = true;
        inputToSend.delivery = true;
        validate.validateServiceOptions(inputToSend);
      }).to.not.throw();
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = false;
        inputToSend.takeOut = true;
        inputToSend.delivery = true;
        validate.validateServiceOptions(inputToSend);
      }).to.not.throw();
      expect(() => {
        const inputToSend = {};
        inputToSend.dineIn = true;
        inputToSend.takeOut = false;
        inputToSend.delivery = false;
        validate.validateServiceOptions(inputToSend);
      }).to.not.throw();
    });
  });

  describe('Validate Id', () => {
    it('Checks for no input', ()=>{
      expect(()=>{
        validate.validateId();
      }).to.throw();
    });
    it('checks for non/empty strings', ()=>{
      expect(()=>{
        validate.validateId('');
      }).to.throw();
      expect(()=>{
        validate.validateId('                        ');
      }).to.throw();
      expect(()=>{
        validate.validateId(true);
      }).to.throw();
      expect(()=>{
        validate.validateId(123);
      }).to.throw();
      expect(()=>{
        validate.validateId(new mdb.ObjectId('ffffffffffffffffffffffff'));
      }).to.throw();
    });
    it('Works for correct input', ()=>{
      expect(()=>{
        validate.validateId('ffffffffffffffffffffffff');
      }).to.not.throw();
    });
  });
});
