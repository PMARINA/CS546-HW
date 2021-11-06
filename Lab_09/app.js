const express = require('express');

const app = express();
const routeConfig = require('./routes');
const static = express.static(__dirname + '/public');
app.use('/public', static);

routeConfig(app);

app.listen(3000, ()=>{
  console.log('Server now running at http://localhost:3000/');
});
