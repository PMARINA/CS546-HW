let {ObjectId} = require('mongodb');

function checkType(parameterName, val, acceptedTypes) {
    if (typeof(acceptedTypes) != 'object') acceptedTypes = [acceptedTypes];
    if (!acceptedTypes.includes(typeof(val))) throw Error(`${parameterName} was of the incorrect type: ${typeof(val)}. Expected ${acceptedTypes}`)
}

function checkNotEmptySpaces(parameterName, val) {
    if (val.trim().length === 0) throw Error(`${parameterName} was empty or just spaces.`)
}

function validateName(name) {
    checkType("Name", name, 'string');
    checkNotEmptySpaces("Name", name);
}

function validateLocation(loc) {
    checkType("Location", loc, 'string');
    checkNotEmptySpaces("Location", loc);
}

function validatePhoneNumber(pn) {
    checkType('Phone Number', pn, 'string');
    if(! pn.match(/^\d{3}-\d{3}-\d{4}$/)) throw Error("Phone number was not of the correct type.")
}

function validateWebsite(addr) {
    checkType('Website', addr, 'string');
    if(! addr.match(/^http(s)?:\/{2}www\.[^ ]{5,}\.com$/)) throw Error("Website was not valid.")
}

const validPriceRanges = ["$", "$$", "$$$", "$$$$"]

function validatePriceRange(pr) {
    checkType("Price Range", pr, 'string');
    if (!validPriceRanges.includes(pr)) throw Error(`Invalid price range: ${pr}. Expected one of ${validPriceRanges}.`);
}

function validateCuisines(cuisines) {
    checkType("Cuisines", cuisines, 'object');
    if (cuisines === null) throw Error("Cuisines cannot be null.");
    if (!Array.isArray(cuisines)) throw Error("Cuisines was not an array.");
    if(cuisines.length <= 0) throw Error("Expected length of Cuisines > 1.")
    const parameterName = "Item of cuisines";
    cuisines.forEach((item) => {
        checkType(parameterName, item, 'string');
        checkNotEmptySpaces(parameterName, item)
    });
}

function validateOverallRating(rating){
    checkType('Overall Rating', rating, 'number');
    if(!(0 <= rating && rating <= 5)){
        throw Error(`Overall rating expected to be between 0 and 5 (inc). Received ${rating}.`);
    }
}

function validateServiceOptions(servOpt){
    checkType("Service Options", servOpt, 'object');
    if(servOpt === null || Array.isArray(servOpt)) throw Error("Expected service options to be an object.");
    if(Object.keys(servOpt).length != 3) throw Error("Expected 3 keys in service options.");
    // This works because obj[random key] yields undefined...
    checkType('Service Options - dine in', servOpt['dineIn'], 'boolean');
    checkType('Service Options - takeout', servOpt['takeOut'], 'boolean');
    checkType('Service Options - delivery', servOpt['delivery'], 'boolean');
}

function validateId(id){
    checkType("id", id, 'string');
    checkNotEmptySpaces("id", id);
    // The following line will throw if not a valid object ID. 
    ObjectId(id);
    throw Error("Not implemented");
    // Check if the id is in the database (perhaps this should be part of the actual method?)
}

module.exports = {checkType, checkNotEmptySpaces, validateName, validateLocation, validatePhoneNumber, validateWebsite, validatePriceRange, validateCuisines, validateOverallRating, validateServiceOptions, validateId};