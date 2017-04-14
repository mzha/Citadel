var mongoose = require('mongoose');

module.exports = mongoose.model('Document',{
  id: String,
  name: String,
  content: String,
  access: [String]
});
