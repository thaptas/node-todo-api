const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());


mongoose.set('useFindAndModify', false);

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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {

  //console.log(req.params);

  try {
    if (!ObjectID.isValid(req.params.id)){
      throw new Error('Todo ID is invalid');
    }
  }
  catch (e){
      return res.status(404).send();
  }

  Todo.findById(req.params.id).then((todo) => {
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  console.log(req.params);
  //get the id variable
  var id = req.params.id;
  try {
    //validate id -- return 404
    if (!ObjectID.isValid(id)){
      throw new Error('Todo ID is invalid');
    }
  }
  catch (e){
      return res.status(404).send();
  }

  Todo.findByIdAndDelete(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }, (e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  //console.log(req.body);
  var body = _.pick(req.body, ['text', 'completed']);

  //console.log(body);

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log('Started on port ' + port);
});

module.exports = {app};
