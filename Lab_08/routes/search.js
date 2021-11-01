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
    res.status(400).render('errors/main',
        {
          layout: 'errors',
          searchTerm: searchTerm,
          form: await ebs.render('views/search/form_horizontal.handlebars',
              {
                formText: searchTerm,
              }),
          errCode: 400,
          errMsg,
        });
  }
  const marvelResponse = (await data(searchTerm)).data.results;
  res.render('results/searchResults',
      {
        layout: 'resultsPages',
        marvelResponse: marvelResponse,
        searchTerm: searchTerm,
        form: await ebs.render('views/search/form.handlebars',
            {
              formText: searchTerm}),
      });
});

module.exports = router;

