require('jest-extended');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Express API server routes POST /todos', () => {

  test('it should create new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });

  test('it should get one todo', (done) => {

      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
  });

  test('should not get todo created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  test('should return 404 if todo not found', (done) => {
    var objID = new ObjectID();

    request(app)
      .get(`/todos/${objID}.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  test('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('Express API server routes DELETE /todos', () => {
  test('should remove todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
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

  test('should not remove todo created by other user', (done) => {
    var hexId = todos[2]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  test('should send 404 if todo not found', (done) => {
    var objID = new ObjectID();

    request(app)
      .delete(`/todos/${objID.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  test('should send 404 if non-object id', (done) => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('Express API server routes PATCH /todos/:id', () => {
  test('should update todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'some other todo content';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text: text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeNumber();
      })
      .end(done);
  });

  test('should not update todo created by other user', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'some other todo content';

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text: text
      })
      .expect(404)
      .end(done);
  });

});

describe('Express API server routes GET /users/me', () => {
  test('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.name).toBe(users[0].name);
      })
      .end(done);
  });

  test('should return 401 if not authenticated - wrong token', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token+'11')
      .expect(401)
      .end(done);
  });

  test('should return 401 if not authenticated - empty object', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('Express API server routes POST /users', () => {
  test('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';
    var name = 'Tomasz';
    request(app)
      .post('/users')
      .send({name, email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.name).toBeTruthy();
      })
      .end((err) => {
        if (err){
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        });

      });
  });

  test('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'and', password: '123', name: 'name'})
      .expect(400)
      .end(done);

  });

  test('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: users[0].password, name: users[0].name})
      .expect(400)
      .end(done);
  });
});

describe('Express API server routes POST /users/login', () => {
  test('should login user and return token', (done) => {
    var email = users[1].email;
    var password = users[1].password;

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });

  test('it should reject invlid login', (done) => {
    var email = users[1].email;
    var password = 'some password';

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).not.toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });
});

describe('Express API server routes DELEte /users/me/token', () => {
  test('should remove auth token on logout', (done) => {
    //DELete req to /users/me/tokens
    //set x-auth equal to tokens
    // 200
    // find user, verify that tokens array has length of zero

    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => {
          done(e);
        });
      });
  });
});
