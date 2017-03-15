var File = require('../../models/file');
var Contract = require('../../models/contract');

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

  getFiles: function(userId, done) {
    File.find({ 'userId': userId}, function(err, files) {
      if (err) {
        return done(-1, null);
      } else {
        return done(0, files);
      }
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
  }
}
