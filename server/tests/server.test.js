const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


beforeEach((done) => {
  Todo.remove({}).then(() => done());
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

        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });


  // test('it should return hello world response', (done) => {
  // //expect.assertions(1);
  //   request(app)
  //     .get('/')
  //     .expect(200)
  // //.expect('Content-Length', '15')
  //     .expect({
  //       error: 'Page not found!',
  //       name: 'Todo App v1.0'
  //     })
  //     .end(done);
  // });
  //
  // test('it should return users array', (done) => {
  // //expect.assertions(1);
  //   request(app)
  //     .get('/users')
  //     .expect(200)
  // //.expect('Content-Length', '15')
  //     .expect((res) => {
  //       expect(res.body).toContainEqual({
  //         name: 'user1',
  //         age: 26
  //       })
  //     })
  //     .end(done);
  // });

});
