var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  id: String,
  username: String,
  password: String,
  isAdmin: Boolean,
  firstName: String,
  lastName: String,
  address: String
});
