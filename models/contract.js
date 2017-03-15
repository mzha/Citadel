var mongoose = require('mongoose');

module.exports = mongoose.model('Contract',{
  id: String,
  userId: String,
  name: String,
  address: String,
  pending: Boolean
});
