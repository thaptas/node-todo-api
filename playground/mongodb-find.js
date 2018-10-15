//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
  if (error) {
    return console.log('Unable to connect to the database');
  }
  console.log('Connected to MongoDB Server');

  const db = client.db('TodoApp');

  db.collection('Todos').find().count().then((count) => {
    console.log('Todos');
    console.log(JSON.stringify(count, undefined, 2));

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  db.collection('Users').find().count().then((count) => {
    console.log('Users');
    console.log(JSON.stringify(count, undefined, 2));

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  db.collection('Users').find().toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));

  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  client.close();
});
