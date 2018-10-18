const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [
  {text : 'first', _id: new ObjectID()},
  {text : 'second', _id: new ObjectID()},
  {text : 'third', _id: new ObjectID()},
  {text : 'fourth', _id: new ObjectID()},
  {text : 'fifth', _id: new ObjectID()}
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    //done());
  }).then(() => done());
});

describe('Express API server routes POST /todos', () => {

  test('it should create new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  test('should not create todo with invalid body data', (done) => {
    var text = '';

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(5);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

});

describe('Express API server routes GET /todos', () => {
  test('it should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(5);
      })
      .end(done);
  });

  test('it should get one todo', (done) => {

      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
  });

  test('should return 404 if todo not found', (done) => {
    var objID = new ObjectID();

    request(app)
      .get(`/todos/${objID}.toHexString()}`)
      .expect(404)
      .end(done);
  });

  test('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('Express API server routes DELETE /todos', () => {
  test('should remove todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeNull();
          done();
        }).catch((e) => done(e));
      });
  });

  test('should send 404 if todo not found', (done) => {
    var objID = new ObjectID();

    request(app)
      .delete(`/todos/${objID.toHexString()}`)
      .expect(404)
      .end(done);
  });

  test('should send 404 if non-object id', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});
