const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//var id = '5bc765bcaa2091d641030efb';
// var id = '5bc765bcaa2091d641030efb_';
//
// if (!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e) => {
//   console.log(e.message);
// });

var userid = '5bc71035b46af57f3ca5e13d';
//var userid = '6bc71035b46af57f3ca5e13d';

if (!ObjectID.isValid(userid)){
  console.log('UserID is not valid');
}

User.find({
  _id: userid
}).then((users) => {
  if (users.length == 0){
    return console.log('User not found');
  }
  console.log('Users: ',users);
});

User.findOne({
  _id: userid
}).then((user) => {
  if (!user){
    return console.log('User not found');
  }
  console.log('User: ', user);
});

User.findById(userid).then((user) => {
  if (!user){
    return console.log('User not found');
  }
  console.log('User By ID: ', user);
});
