//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
  if (error) {
    return console.log('Unable to connect to the database');
  }
  console.log('Connected to MongoDB Server');

  const db = client.db('TodoApp');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'some todo'}).then((result) => {
  //   console.log(result.result);
  // });

  //deleteOne
  // db.collection('Todos').deleteOne({text: 'some todo'}).then((result) => {
  //   console.log(result.result);
  // });

  //findOneAndDelete
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(result);
  });



  client.close();
});
