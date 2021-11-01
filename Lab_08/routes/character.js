const express = require('express');
const router = new express.Router();
const data = require('../data/characters').getCharacter;
const ebs = require('express-handlebars').create();
router.get('/:id', async (req, res) => {
  // console.log(req);
  const id = req.params.id;
  if (typeof id !== 'string' || id.trim().length <= 0 || isNaN(id.trim())) {
    let errMsg = undefined;
    if (typeof id !== 'string') {
      errMsg = 'ID was not a string.';
    } else if (id.trim().length <= 0) {
      errMsg = 'ID was either empty or just empty spaces.';
    } else if (isNaN(id.trim())) {
      errMsg = 'ID was not a number.';
    } else {
      errMsg = 'Unknown error.';
    }
    res.status(400).render('errors/main',
        {
          layout: 'errors',
          id: id,
          form: await ebs.render('views/search/form.handlebars',
              {
                formText: id,
              }),
          errCode: 400,
          errMsg,
        });
  }
  const response = (await data(id));
  if (response.code === 200) {
    const marvelResponse = response.data.results[0];
    res.render('results/profileView',
        {
          layout: 'profileView',
          marvelResponse: marvelResponse,
          id: id,
          form: await ebs.render('views/search/form_horizontal.handlebars',
              {
                formText: marvelResponse.name,
              }),
          attrHTML: response.attributionHTML,
          title: marvelResponse.name,
        });
  } else {
    res.render('errors/main', {
      layout: 'errors',
      id: id,
      errCode: 404,
      errMsg: 'Character not found.',
      form: await ebs.render('views/search/form_horizontal.handlebars'),
    });
  }
});

module.exports = router;

