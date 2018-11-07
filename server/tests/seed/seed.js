
const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  name: 'Tomasz',
  email: 'tomasz@haptas.pl',
  password: 'tomasz@haptas.pl',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  name: 'Tomasz',
  email: 'tomasz1@haptas.pl',
  password: 'tomasz1@haptas.pl',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const todos = [
  {text : 'first', _id: new ObjectID(), _creator: userOneId},
  {text : 'second', _id: new ObjectID(), _creator: userOneId},
  {text : 'third', _id: new ObjectID(), _creator: userTwoId},
  {text : 'fourth', _id: new ObjectID(), _creator: userOneId},
  {text : 'fifth', _id: new ObjectID(), _creator: userTwoId}
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => {
    done();
  });
};

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  //done());
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
