const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [
  {text : 'first'},
  {text : 'second'},
  {text : 'third'},
  {text : 'fourth'},
  {text : 'fifth'}
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
});
