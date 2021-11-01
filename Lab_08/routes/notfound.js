const express = require('express');
const router = new express.Router();
const ebs = require('express-handlebars').create();
router.get('*', async (req, res) => {
  res.status(404).render('errors/main',
      {
        layout: 'errors',
        form: await ebs.render('views/search/form_horizontal.handlebars',
            {
              formText: '',
            }),
        errCode: 404,
        errMsg: 'Invalid Path',
      });
});

module.exports = router;

