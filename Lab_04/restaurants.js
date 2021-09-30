require('mongoConnection')
{validateName, validateLocation, validatePhoneNumber, validateWebsite, validatePriceRange, validateCuisines, validateOverallRating, validateServiceOptions} = require('validate');
async create(name, location, phoneNumber, website, priceRange, cuisines, overallRating, serviceOptions){
    validateName(name);
    validateLocation(location);
    validatePhoneNumber(phoneNumber);
    validateWebsite(website);
    validatePriceRange(priceRange);
    validateCuisines(cuisines);
    validateOverallRating(overallRating);
    validateServiceOptions(serviceOptions);
}
