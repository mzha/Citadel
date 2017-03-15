var mongoose = require('mongoose');

module.exports = mongoose.model('File',{
  id: String,
  userId: String,
  name: String,
  hash: String,
  pending: Boolean
});
