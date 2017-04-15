pragma solidity ^0.4.0;
pragma solidity ^0.4.0;

/*
access.challenge.addFile("1","1","1"{from: web3.eth.accounts[1], value: web3.toWei(5, "ether"), gas: 999999})
scheme.requestAccess("1", "1" {from: web3.eth.accounts[1], gas: 999999})
*/

contract Access{
    address public contractAddress;
	address adminAddress;
    bytes32 adminkey;
	bytes32 public contractkey;
	bool contractStatus= true;
    request[] allrequests;

	///user(id) to file.id) to request
	mapping(bytes32 => mapping( bytes32 =>request)) public acl;

	//used for before and after modifier
	uint timeout;

	//maps user.id to other attributes
	mapping(bytes32 => user) idUsers;
	//all requests directly per user
	//mapping(bytes32 => request[]) requests;
	//all requests directly per file
	//mapping(bytes32 => request[]) file2requests;

	//maps a file.id to other file attributes
	mapping(bytes32 => file) idFiles;


		 modifier onlyBy(user _account){
	       if (msg.sender != _account.user_addr) throw;
	       _;
	   }

	   modifier onlyIfActive() {
	     if (contractStatus == false) throw;
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
		bytes32 fileid;
		uint timestamp;
		bool confirmed;
		bool granted;	
		bool status;
	}

	struct file{
		bytes32 id;
		uint timestamp;
	}

	struct user{
		bytes32 id;
		bool isAdmin;
		string name;

		address user_addr;

	}

	//constructor
	function Access(bytes32 contractkey, bytes32 userkey, string name){
	    adminkey = userkey;
		adminAddress = msg.sender; //assumes that the creator of contract is valid admin, can be changed
		addUser(userkey, name,msg.sender);
		contractkey = contractkey;
		contractAddress = this;
		contractStatus = true;
		
		timeout = 3000;
	}

	//write Access for Admins

	function addUser(bytes32 id, string name, address user_addr) onlyIfActive onlyByCreator{
	 	if(msg.sender == adminAddress){
	 	    idUsers[id] = user(id,true,name,user_addr);
	 	}else{
	 	    idUsers[id] = user(id,false,name,user_addr);
	 	}
	}

	function getUserAddress(bytes32 id) returns (address){
		return idUsers[id].user_addr;
	}

//modify so non admins have write file priveleges
	function addFile(bytes32 id) onlyIfActive{
	 
	 	idFiles[id] = file(id,now);
	 	
	}



	function getRequestfromId(bytes32 id,bytes32 fileid) returns(bool) {
		return acl[id][fileid].status;
	}
	
	function getRequestTimeStampfromId(bytes32 id,bytes32 fileid) returns(uint) {
		return acl[id][fileid].timestamp;
	}

	function promote(bytes32 id) onlyByCreator {
		idUsers[adminkey].isAdmin = false;
		idUsers[id].isAdmin = true;
		adminAddress = idUsers[id].user_addr;


	}
	function getContractAddress() returns (address){
	    return contractAddress;
	}



	function checkTimeout() constant returns (uint) { 
    return timeout - now;
  }

  function requestAccess(bytes32 user_id, bytes32 fileid) onlyIfActive returns(bytes32,bytes32){
  		//
  	    
  		if(idFiles[fileid].id != bytes32(0x00000000) ){
  		    
  		    user requester = idUsers[user_id];
  			acl[user_id][fileid] = request(msg.sender,user_id,fileid,now,false,true,false);
  			
  			return(user_id,fileid);
  		} else{
  		    
  			return (bytes32(0x00000000),bytes32(0x00000000));
  		}
  }
  

  
  function confirmAccess(bytes32 user_id, bytes32 fileid, bool accepted) onlyIfActive onlyByCreator returns(bytes32) {
      
      acl[user_id][fileid].confirmed = accepted;
      if(acl[user_id][fileid].confirmed == true && acl[user_id][fileid].granted ==true ){
          acl[user_id][fileid].status = true;
          acl[user_id][fileid].timestamp = now;
        
  		 allrequests.push(acl[user_id][fileid]);
      }else{
           acl[user_id][fileid].timestamp = now;
  		  allrequests.push(acl[user_id][fileid]);
      }
      return fileid;
  }
  
 
  function printAllRequests() constant returns (bytes32[],bytes32[],uint[],bool[]){
    
     bytes32[] memory a = new bytes32[](allrequests.length);
      uint[] memory b = new uint[](allrequests.length);
      bool[] memory c = new bool[](allrequests.length);
      bytes32[] memory d = new bytes32[](allrequests.length);
     for(uint j = 0; j <allrequests.length;j++ ){

        request r = allrequests[j]; 
          a[j] = r.accesserid;
          b[j] = r.timestamp;
          c[j] = r.status;
          d[j] = r.fileid;
     
      }
      return(a,d,b,c);
  }
  
//   function printAllforFile(bytes32 fileid) constant returns (bytes32[],uint[],bool[]){
//       request[] r = file2requests[fileid];
//       bytes32[] memory a = new bytes32[](r.length);
//       uint[] memory b = new uint[](r.length);
//       bool[] memory c = new bool[](r.length);
//       for(uint i = 0; i <r.length;i++ ){
//           a[i] = r[i].accesserid;
//           b[i] = r[i].timestamp;
//           c[i] = r[i].status;
//       }
//       return(a,b,c);
//   }

  
  function deactivateContract() onlyByCreator {
      contractStatus = false;
    }

}

contract Manager {
    mapping(bytes32=>address) access_map;
    
    function Manager(){}
    
    function createAccessContract (bytes32 userkey, string name) returns (bytes32){
        bytes32 contractkey = sha256(userkey,name,msg.sender);
        Access a = new Access(contractkey,userkey,name);
         access_map[contractkey] = a.getContractAddress();
         return(contractkey);
    }
    
    function callAddFile(bytes32 contractkey,bytes32 id){
        address Access_Contract = access_map[contractkey];
        Access a = Access(Access_Contract);
        a.addFile(id);
    }
    
    function callAddUser(bytes32 contractkey, bytes32 id, string name, address user_addr){
        address Access_Contract = access_map[contractkey];
        Access a = Access(Access_Contract);
        a.addUser(id, name,  user_addr);
    }
    function callRequestAccess(bytes32 contractkey,bytes32 user_id, bytes32 file_id){
        address Access_Contract = access_map[contractkey];
        Access a = Access(Access_Contract);
        a.requestAccess(user_id,file_id);
    }
    function callConfirmAccess(bytes32 contractkey,bytes32 user_id, bytes32 fileid, bool accepted){
        address Access_Contract = access_map[contractkey];
        Access a = Access(Access_Contract);
        a.confirmAccess(user_id, fileid, accepted);
    }
    
}
