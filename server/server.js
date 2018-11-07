require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());


mongoose.set('useFindAndModify', false);

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      completed: req.body.completed,
      _creator: req.user._id
    });

    todo.save().then((doc) => {
      res.send(doc);

    }, (e) => {
      res.status(400).send(e);
    })
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {

  //console.log(req.params);

  try {
    if (!ObjectID.isValid(req.params.id)){
      throw new Error('Todo ID is invalid');
    }
  }
  catch (e){
      return res.status(404).send();
  }

  Todo.findOne({
    _id: req.params.id,
    _creator: req.user._id}).then((todo) => {
      if (!todo){
        return res.status(404).send();
      }

      res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});

  }, (e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }

    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});

//POST /user

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['name', 'email', 'password']);

    var user = new User(body);

//    User.findByToken
//    user.generateAuthToken


    user.save().then((user) => {
      return user.generateAuthToken();

    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    });
});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login {email, password}

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.delete('/users/me/token', authenticate, (req, res) => {
  console.log(req.user);

  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log('Started on port ' + port);
});

module.exports = {app};
