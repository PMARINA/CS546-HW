const express = require('express')
const app = express();
const portNumber = 3000;
app.use('/', express.static('public'));

app.listen(portNumber, ()=>{
  console.log(`App is running at port ${portNumber}`);
  console.log(`Visit your site @ http://localhost:${portNumber}`)
})
