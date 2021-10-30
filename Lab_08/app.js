const express = require('express');
const app = express();
const configRoutes = require('./routes');
const config = require('./config');
const static = express.static(__dirname + config.APP.PUBDIR);
const bs = require('express-handlebars');

app.use(config.APP.PUBDIR, static);

// We are no longer using json responses, but just in case?
app.use(express.json());
// Need urlencoded args
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', bs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


configRoutes(app);


app.listen(3000, () => {
  console.log('We\'ve now got a server!');
  console.log('Your routes will be running on http://localhost:3000');
});
