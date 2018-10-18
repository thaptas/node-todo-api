const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//deprecated
// Todo.remove({}).then((result) => {
//   console.log(result);
// });



//Todo.findOneAndRemove
//Todo.findByIdAndRemove

Todo.findByIdAndDelete('5bc87444f6c00a1e3fdba778').then((result) => {
  console.log(result);
});
