const express = require('express');
const router = new express.Router();
// const bs = require('handlebars');
const ebs = require('express-handlebars').create();

router.get('/', async (req, res) => {
  res.render('search/searchPage',
      {form: await ebs.render('views/search/form.handlebars')});
});

module.exports = router;

