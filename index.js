var express = require("express");
var path = require('path');
var app = express();


app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, '/public/')));

app.get("/", function(req, res) {
  console.log(req.body);
  res.render('index');
});

app.listen(process.env.PORT || 3000)