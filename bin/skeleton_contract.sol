pragma solidity ^0.4.0;

/*
access.addFile("1","1","1"{from: web3.eth.accounts[1], value: web3.toWei(5, "ether"), gas: 999999})
access.requestAccess("1", "1" {from: web3.eth.accounts[1], gas: 999999})
*/

contract Access{
	address accessers;
	address adminAddress;
	bytes32 key;
	bool contractStatus= false;

	///user(id) to file.id) to request
	mapping(bytes32 => mapping( bytes32 =>request)) public acl;

	//used for before and after modifier
	uint timeout;
	//maps public hash that files are created with
	mapping(bytes32 => file) hash2file;
	//maps user.id to other attributes
	mapping(bytes32 => user) idUsers;

	//maps a file.id to other file attributes
	mapping(bytes32 => file) idFiles;


		 modifier onlyBy(user _account){
	       if (msg.sender != _account.user_addr) throw;
	       _;
	   }

	   modifier onlyIfActive() {
	     if (contractStatus) throw;
	     _;
	   }

	   modifier onlyByCreator(){
	      if (msg.sender != adminAddress) throw;
	      _;
	  }

	   modifier onlyAfter(uint _time) {
	      if (now < _time) throw;
	      _;
	   }

	   modifier onlyBefore(uint _time) {
	     if (now > _time) throw;
	     _;
	   }

	struct request{
		address accesser;
		bytes32 accesserid;
		uint timestamp;
		bool granted;
	}

	struct file{
		bytes32 id;
		bytes32 hash;
	}

	struct user{
		bytes32 id;
		bool isAdmin;
		bytes32 first;
		bytes32 last;
		address user_addr;

	}

	//constructor
	function Access(bytes32 key, bytes32 first, bytes32 last){
		accessers = msg.sender;
		adminAddress = msg.sender; //assumes that the creator of contract is valid admin, can be changed
		addUser(key, first,last,msg.sender);
		key = key;
		contractStatus = true;
		timeout = 3000;
	}

	//write Access for Admins

	function addUser(bytes32 id, bytes32 first, bytes32 last, address user_addr) onlyIfActive onlyByCreator{
	 	if(msg.sender == adminAddress){
	 	    idUsers[id] = user(id,true,first,last,user_addr);
	 	}else{
	 	    idUsers[id] = user(id,false,first,last,user_addr);
	 	}
	}

	function getUserAddress(bytes32 id) returns (address){
		return idUsers[id].user_addr;
	}

//modify so non admins have write file priveleges
	function addFile(bytes32 id, bytes32 public_hash) onlyIfActive onlyByCreator{

	 	idFiles[id] = file(id,sha256(public_hash));
	 	bytes32 access = idFiles[id].hash;
	 	hash2file[access] = idFiles[id];
	}

	function getHashFile(bytes32 id) internal returns(bytes32) {
		return idFiles[id].hash;
	}

	function getRequestfromId(bytes32 id,bytes32 fileid) returns(bool) {
		return acl[id][fileid].granted;
	}

	function getRequestTimeStampfromId(bytes32 id,bytes32 fileid) returns(uint) {
		return acl[id][fileid].timestamp;
	}

	function promote(bytes32 id) onlyByCreator {
		idUsers[key].isAdmin = false;
		idUsers[id].isAdmin = true;
		adminAddress = idUsers[id].user_addr;


	}

	function hash(bytes32 public_key, uint hash_function)  internal returns (bytes32) {
		if(hash_function==1){
		return keccak256(public_key);
		}
		else if(hash_function ==2){
		return sha3(public_key);
		}
		return sha256(public_key);
	}

	function checkTimeout() constant returns (uint) {
    return timeout - now;
  }

  function requestAccess(bytes32 user_id, bytes32 public_hash) onlyIfActive{
  		//
  		if(hash2file[public_hash].hash != bytes32(0x00000000) ){
  		    file access = hash2file[public_hash];
  		    user requester = idUsers[user_id];
  			acl[user_id][access.id] = request(msg.sender,user_id,now,true);
  		} else{
  		    file access1 = hash2file[public_hash];
  			acl[user_id][access1.id] = request(msg.sender,user_id,now,false);
  		}
  }
  function deactivateContract() onlyByCreator {
      contractStatus = false;
    }

}
