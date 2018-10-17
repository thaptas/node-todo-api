//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {
  if (error) {
    return console.log('Unable to connect to the database');
  }
  console.log('Connected to MongoDB Server');
  const db = client.db('TodoApp');

  db.collection('Todos').findOneAndUpdate(
    {
      _id: new ObjectID('5bc700c8f6c00a1e3fdb69e2')
    }, {
        //update operators
        $set: {
          completed: true
        }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result);
  });

  db.collection('Users').findOneAndUpdate(
    {
      _id: new ObjectID('5bc4b8b8938de517d84c4a1d')
    }, {
        //update operators
        $set: {
          name: 'Adrian'
        },
        $inc: {
          age: 10
        }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(result);
  });


  client.close();
});
