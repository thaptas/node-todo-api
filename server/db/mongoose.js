var mongoose = require('mongoose');
const mongodbUri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

mongoose.connect(mongodbUri, { useNewUrlParser: true });

module.exports = {
  mongoose: mongoose
};
