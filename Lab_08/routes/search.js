const express = require('express');
const router = new express.Router();
const data = require('../data/search').getResults;
const ebs = require('express-handlebars').create();
router.post('/', async (req, res) => {
  // console.log(req);
  const searchTerm = req.body['Search Term'];
  if (typeof searchTerm !== 'string' || searchTerm.trim().length <= 0) {
    let errMsg = undefined;
    if (typeof searchTerm !== 'string') {
      errMsg = 'Search term was not a string.';
    } else {
      errMsg = 'Search term was either empty or just empty spaces.';
    }
    res.status(400).render('errors/main', {
      layout: 'errors',
      searchTerm: searchTerm,
      form: await ebs.render('views/search/form_horizontal.handlebars', {
        formText: searchTerm,
      }),
      errCode: 400,
      errMsg,
    });
  }
  let marvelResponse = await data(searchTerm);
  if (typeof marvelResponse == 'string') {
    errCode = marvelResponse.match(/^.*?(\d*)$/)[1];
    errCode = 400;
    // Simon told me to hard code it to 400,
    // instead of using the one Marvel returned.
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
  } else {
    marvelResponse = marvelResponse.data.results;
  }
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
