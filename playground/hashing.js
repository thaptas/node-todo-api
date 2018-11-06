const crypto = require('crypto');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

var token = jwt.sign(data, '123abc');
console.log('Token', token);

var decoded = jwt.verify(token, '123abc');
console.log('Decoded:', decoded);
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
