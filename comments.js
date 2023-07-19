// Create web server using Express
// 1. npm install express
// 2. Create a file called server.js
// 3. Add the following code to server.js
// 4. node server.js
// 5. Open browser and type in http://localhost:3000/comments
// 6. You should see the results of the comments.json file
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var comments = require('./comments.json');
var _ = require('lodash');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/comments', function(req, res) {
  res.json(comments);
});

app.post('/comments', function(req, res) {
  var newComment = req.body;
  comments.push(newComment);
  fs.writeFile('./comments.json', JSON.stringify(comments, null, 4), function(err) {
    res.json(comments);
  });
});

app.get('/comments/:id', function(req, res) {
  var comment = _.find(comments, { id: req.params.id });
  res.json(comment || {});
});

app.put('/comments/:id', function(req, res) {
  var update = req.body;
  if (update.id) {
    delete update.id;
  }

  var comment = _.findIndex(comments, { id: req.params.id });
  if (!comments[comment]) {
    res.send();
  } else {
    var updatedComment = _.assign(comments[comment], update);
    res.json(updatedComment);
  }
});

app.delete('/comments/:id', function(req, res) {
  var comment = _.findIndex(comments, { id: req.params.id });
  if (!comments[comment]) {
    res.send();
  } else {
    var deletedComment = comments[comment];
    comments.splice(comment, 1);
    res.json(deletedComment);
  }
});

app.listen(3000, function() {
  console.log('Comments server listening on port 3000');
});
