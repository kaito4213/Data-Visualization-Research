var express = require('express');
var app = express();
var path = require('path');

// get chart
app.get('/get-data', function (req, res) {
  // put all of the static resources under public folder
  app.use(express.static(__dirname + '/public'));
  res.sendFile(path.join(__dirname + '/template.html'));
});

app.listen(3000, function () {
  console.log(__dirname);
});