const express = require('express');
const router = new express.Router();
const data = require('../data/search').getResults;
const ebs = require('express-handlebars').create();

// POST search endpoint
// Return <= 20 characters whose names start with the given input (see req body)
router.post('/', async (req, res) => {
  const searchTerm = req.body['Search Term'];
  // Validate the search term
  // Must be a string
  // Must be non-empty or contain only spaces
  if (typeof searchTerm !== 'string' || searchTerm.trim().length <= 0) {
    let errMsg = undefined;
    if (typeof searchTerm !== 'string') {
      errMsg = 'Search term was not a string.';
    } else {
      errMsg = 'Search term was either empty or just empty spaces.';
    }
    // There was something wrong with the user input so err 400
    res.status(400).render('errors/main', {
      layout: 'errors',
      searchTerm: searchTerm,
      form: await ebs.render('views/search/form_horizontal.handlebars', {
        formText: searchTerm, // pass it back to allow the user to make modifications
      }),
      errCode: 400,
      errMsg,
    });
  }
  
  // All checks have passed, now perform the API call to Marvel
  let marvelResponse = await data(searchTerm);
  
  // If there was a problem during the request, we simply return a string
  // see the declaration in data/search.js
  if (typeof marvelResponse == 'string') {
    // The message was at the end of the string, so grab it using a simple regex
    errCode = marvelResponse.match(/^.*?(\d*)$/)[1];
    // Simon told me to hard code it to 400,
    // instead of using the one Marvel returned.
    errCode = 400;
    res.render('errors/main', {
      layout: 'errors',
      searchTerm: searchTerm,
      form: await ebs.render('views/search/form_horizontal.handlebars', {
        formText: searchTerm,
      }),
      errCode,
      errMsg: marvelResponse,
    });
    return;
    // Abort rendering anything after creating the error response
  } else {
    // If the status was ok, then get the actual results into the object
    marvelResponse = marvelResponse.data.results;
  }
  // Render the search results page...
  res.render('results/searchResults', {
    layout: 'resultsPages',
    marvelResponse: marvelResponse,
    searchTerm: searchTerm,
    form: await ebs.render('views/search/form.handlebars', {
      formText: searchTerm,
    }),
  });
});

module.exports = router;
