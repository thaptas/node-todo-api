var express = require('express');
var bodyParser = require('body-parser');

var {mangoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Started on port 3000');
});

app.post('/todos', (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      completed: req.body.completed
    });

    todo.save().then((doc) => {
      res.send(doc);

    }, (e) => {
      res.status(400).send(e);
    })
});

module.exports = {app};
// var newTodo = new Todo({
//     text: 'Cook dinner',
//     completed: false,
//
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved togo', doc);
// }, (e) => {
//   console.log('Unable to save todo');
// });

// var otherTodo = new Todo({
//   text: 'First Validated '
// });

// otherTodo.save().then((doc) => {
//   console.log('Saved todo', doc);
// }, (e) => {
//   console.log('Unable to save todo', e);
// });

//
// var user = new User({
//     name: 'Tomasz',
//     email: 'tomasz@haptas.pl'
// });
//
// user.save().then((doc) => {
//   console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Something went wrong...');
// })
