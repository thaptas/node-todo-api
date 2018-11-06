const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

//salting passwords
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$mOTZhb.ltU4zWsIXoQcZ2unRedKiE7x8qEo4volI0rnSfpBG6.pZm';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});



// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc');
// console.log('Token', token);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('Decoded:', decoded);
//jwt.verify

// var message = 'I am dumb';
// var hash = crypto.createHmac('sha256', message)
//                    .update('I love cupcakes')
//                    .digest('hex').toString();
//
// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);
//
//
//
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data: data,
//   hash: crypto.createHmac('sha256', JSON.stringify(data).toString())
//     .update('token')
//     .digest('hex').toString()
// };
//
// // token.data.id = 5;
// // token.hash = crypto.createHmac('sha256', JSON.stringify(data).toString())
// //   .digest('hex').toString();
//
// var resultHash = crypto.createHmac('sha256', JSON.stringify(token.data).toString())
//   .update('token')
//   .digest('hex').toString();
//
//   if (resultHash === token.hash) {
//     console.log('Data was not changed');
//   } else {
//     console.log('Data was changed - Do not trust');
//   }
