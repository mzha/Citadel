var File = require('../../models/file');
var Contract = require('../../models/contract');
var Document = require('../../models/doc');

var makeHash = function(size) { //Helper function to make random hash for now
 var text = "";
 var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

 for( var i=0; i < size; i++ )
     text += possible.charAt(Math.floor(Math.random() * possible.length));

 return text;
}

module.exports = {
  addFile: function(userId, name, hash, done) {
    File.findOne({ 'hash': hash}, function(err, file) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in addFile: '+err);
            return done(-1, null);
        }
        // already exists
        if (file) {
            console.log('File already exists');
            return done(1, null);
        } else {
            var newFile = new File();

            // set the file params
            newFile.userId = userId;
            newFile.name = name;
            newFile.hash = hash;
            newFile.pending = true;
            newFile.approved = false;

            // save the user
            newFile.save(function(err) {
                if (err){
                    console.log('Error in saving file: '+err);
                    throw err;
                }
                console.log('File save succesful');
                return done(0, newFile);
            });
        }
    });
  },

  changeFile: function(fileId, approved, done) {
    File.findOneAndUpdate({_id: fileId}, {'approved': approved, 'pending': false}, {upsert:false}, function(err, file){
      if (err){
        return done(-1, null);
      }
      return done(1, file);
    });
  },

  getFiles: function(userId, done) {
    File.find({ 'userId': userId}, function(err, files) {
      if (err) {
        return done(-1, null);
      } else {
        return done(0, files);
      }
    });
  },

  deleteFile: function(fileId, done) {
    File.remove({_id: fileId}, function(err) {
      done();
    });
  },

  addContract: function(userId, name, ether, done) {
    //TODO: Insert code to make new contract
    var address = "";
    Contract.findOne({ 'address': address}, function(err, contract) {
        // In case of any error, return using the done method
        if (err){
            console.log('Error in addContract: '+err);
            return done(-1, null);
        }
        // already exists
        if (contract) {
            console.log('Contract already exists');
            return done(1, null);
        } else {
            var newContract = new Contract();

            var address = makeHash(16);
            // set the file params
            newContract.userId = userId;
            newContract.name = name;
            newContract.address = address;
            newContract.pending = true;

            // save the user
            newContract.save(function(err) {
                if (err){
                    console.log('Error in saving contract: '+err);
                    throw err;
                }
                console.log('Contract save succesful');
                return done(0, newContract);
            });
        }
    });
  },

  getContracts: function(userId, done) {
    Contract.find({ 'userId': userId}, function(err, contracts) {
      if (err) {
        return done(-1, null);
      } else {
        return done(0, contracts);
      }
    });
  },

  addDocument: function(name, content, users, done) {
    Document.findOne({'name':name}, function(err, document) {
      if (err){
          console.log('Error in addDocument: '+err);
          return done(-1, null);
      }
      // already exists
      if (document) {
          console.log('Document already exists');
          return done(1, null);
      } else {
          var newDocument = new Document();

          // set the file params
          newDocument.name = name;
          newDocument.content = content;
          newDocument.access = users;

          // save the user
          newDocument.save(function(err) {
              if (err){
                  console.log('Error in saving document: '+err);
                  throw err;
              }
              console.log('Document save succesful');
              return done(0, newDocument);
          });
      }
    });
  },

  getDocument: function(user_id, document_id, done) {
    console.log(user_id + "," + document_id);
    Document.where({_id: document_id}).findOne(function(err, document) {
      console.log("document is " + document);
      if (document.access.indexOf(user_id) >= 0) {
        return done(1, document);
      } else {
        return done(-1, null);
      }
    });
  }
}
