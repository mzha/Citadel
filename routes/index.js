var express = require('express');
var database = require('../public/javascripts/database.js');
var router = express.Router();
var Web3 = require('web3');

/* Functions */
var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

var isAdmin = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.user.isAdmin)
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/home');
}

var hashCode = function(string) {
  var hash = 0, i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
		res.render('login', { flash: req.flash(), title: 'Citadel' });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		// var web3;
		// if (typeof web3 !== 'undefined') {
		//   web3 = new Web3(web3.currentProvider);
		// } else {
		//   // set the provider you want from Web3.providers
		//   web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8101"));
		// }
		// web3.personal.unlockAccount(web3.eth.accounts[0], "password");
		// web3.personal.unlockAccount(web3.eth.accounts[1], "password");
		// var schemeContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"checkCurrentPlayer","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"checkDeadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"showBoard","outputs":[{"name":"","type":"uint256[3][3]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"player","type":"uint256"},{"name":"r1","type":"uint256"},{"name":"r2","type":"uint256"},{"name":"r3","type":"uint256"},{"name":"c1","type":"uint256"},{"name":"c2","type":"uint256"},{"name":"c3","type":"uint256"}],"name":"check","outputs":[{"name":"retVal","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"checkInGame","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"row","type":"uint256"},{"name":"col","type":"uint256"}],"name":"play","outputs":[{"name":"","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLegend","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"checkWinner","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"checkBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"challenge","outputs":[{"name":"","type":"string"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"currentKing","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]);
		// var scheme = schemeContract.new(
		//    {
		//      from: web3.eth.accounts[0],
		//      data: '0x6060604052341561000c57fe5b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610bb860018190555060006002819055506000600360006101000a81548160ff021916908315150217905550600060108190555060006012819055506100a56100ab64010000000002611330176401000000009004565b5b610113565b600060005b600382101561010e575b60038110156101005760006004836003811015156100d457fe5b6003020160005b50826003811015156100e957fe5b0160005b50819055505b80806001019150506100ba565b5b81806001019250506100b0565b5b5050565b61142f80620001236000396000f300606060405236156100b8576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806330e1de5f146100ba5780633ccfd60b1461010c57806343bf99361461013657806349a9798d1461015c5780634d105e31146101db5780636a05e403146102495780637bc49a95146102e257806389f53efa1461031f578063ad38867e146103b8578063c71daccb146103de578063d2ef739814610404578063f5b4571414610495575bfe5b34156100c257fe5b6100ca6104e7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561011457fe5b61011c610523565b604051808215151515815260200191505060405180910390f35b341561013e57fe5b610146610646565b6040518082815260200191505060405180910390f35b341561016457fe5b61016c610653565b604051808260036000925b818410156101cb57828460200201516003602002808383600083146101bb575b8051825260208311156101bb57602082019150602081019050602083039250610197565b5050509050019260010192610177565b9250505091505060405180910390f35b34156101e357fe5b61022f60048080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919080359060200190919050506106db565b604051808215151515815260200191505060405180910390f35b341561025157fe5b610259610794565b60405180806020018281038252838181518152602001915080519060200190808383600083146102a8575b8051825260208311156102a857602082019150602081019050602083039250610284565b505050905090810190601f1680156102d45780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102ea57fe5b6103096004808035906020019091908035906020019091905050610902565b6040518082815260200191505060405180910390f35b341561032757fe5b61032f610b04565b604051808060200182810382528381815181526020019150805190602001908083836000831461037e575b80518252602083111561037e5760208201915060208101905060208303925061035a565b505050905090810190601f1680156103aa5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156103c057fe5b6103c8610b95565b6040518082815260200191505060405180910390f35b34156103e657fe5b6103ee610ba0565b6040518082815260200191505060405180910390f35b61040c610be8565b604051808060200182810382528381815181526020019150805190602001908083836000831461045b575b80518252602083111561045b57602082019150602081019050602083039250610437565b505050905090810190601f1680156104875780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561049d57fe5b6104a5610f00565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600d6010546003811015156104fa57fe5b0160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b60006000601360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000601360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051809050600060405180830381858888f19350505050156105f45760019150610642565b80601360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060009150610642565b5b5090565b6000426011540390505b90565b61065b611398565b6004600380602002604051908101604052809291906000905b828210156106d15783826003020160005b506003806020026040519081016040528092919082600380156106bd576020028201915b8154815260200190600101908083116106a9575b505050505081526020019060010190610674565b5050505090505b90565b6000876004886003811015156106ed57fe5b6003020160005b508560038110151561070257fe5b0160005b505414801561073d57508760048760038110151561072057fe5b6003020160005b508460038110151561073557fe5b0160005b5054145b801561077157508760048660038110151561075457fe5b6003020160005b508360038110151561076957fe5b0160005b5054145b1561077f5760019050610789565b60009050610789565b5b979650505050505050565b61079c6113c7565b600360009054906101000a900460ff16801561087d5750600d60016003811015156107c357fe5b0160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061087c5750600d600260038110151561082a57fe5b0160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b5b156108c057604060405190810160405280601081526020017f596f752061726520696e2067616d652e0000000000000000000000000000000081525090506108ff565b604060405190810160405280601481526020017f596f7520617265206e6f7420696e2067616d652e00000000000000000000000081525090506108ff565b5b90565b6000600360009054906101000a900460ff1615610afd576011544210151561093357610932601054600303610f2b565b5b600d60105460038110151561094457fe5b0160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610ad35760008310806109a95750600283115b806109b45750600082105b806109bf5750600282115b156109ec577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9050610afc565b60006004846003811015156109fd57fe5b6003020160005b5083600381101515610a1257fe5b0160005b5054141515610a47577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9050610afc565b601054600484600381101515610a5957fe5b6003020160005b5083600381101515610a6e57fe5b0160005b5081905550610a826010546110f9565b15610a9757610a92601054610f2b565b610acc565b610a9f61119d565b15610ab357610aae6000610f2b565b610acb565b601054600303601081905550610e1042016011819055505b5b5b5b610afb565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9050610afc565b5b5b5b92915050565b610b0c6113c7565b608060405190810160405280605a81526020017f5468652063757272656e74206b696e6720697320706c6179657220312e20546881526020017f65206368616c6c656e67657220697320706c6179657220322e2055736520736881526020017f6f77426f617264282920746f207365652074686520626f61726400000000000081525090505b90565b600060125490505b90565b6000601360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490505b90565b610bf06113c7565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610d1d5734601360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550608060405190810160405280604481526020017f596f7520617265207468652063757272656e7420706179656520616e6420636181526020017f6e206e6f7420676f20696e746f2067616d6520616761696e737420796f75727381526020017f656c662e000000000000000000000000000000000000000000000000000000008152509050610efd565b600a600154600b02811515610d2e57fe5b04341015610de75734601360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550606060405190810160405280602881526020017f596f7520646964206e6f742070757420696e20656e6f7567682065746865722081526020017f746f20706c61792e0000000000000000000000000000000000000000000000008152509050610efd565b600360009054906101000a900460ff1615610ead5734601360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550606060405190810160405280603b81526020017f536f7272792c20736f6d656f6e6520656c736520697320696e2067616d652e2081526020017f596f752063616e20636f6c6c65637420796f75722065746865722e00000000008152509050610efd565b34600281905550610ebd33611232565b604060405190810160405280601481526020017f596f7520617265206e6f7720696e2067616d65210000000000000000000000008152509050610efd565b5b5b90565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b60028114156110505760015460136000600d6001600381101515610f4b57fe5b0160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055506001546002540360136000600d6002600381101515610fd057fe5b0160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555060025460018190555060006002819055506110da565b60025460136000600d600160038110151561106757fe5b0160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555060006002819055505b6000600360006101000a81548160ff0219169083151502179055505b50565b60006000611112836000600160026000600160026106db565b8061112e575061112d836000600160026002600160006106db565b5b1561113c5760019150611197565b5b600381101561119657611158838283846000600160026106db565b806111715750611170836000600160028586876106db565b5b1561117f5760019150611197565b60009150611197565b5b808060010191505061113d565b5b50919050565b6000600060006000600092505b6003821015611214575b60038110156112065760006004836003811015156111ce57fe5b6003020160005b50826003811015156111e357fe5b0160005b505411156111f85782806001019350505b5b80806001019150506111b4565b5b81806001019250506111aa565b600983101515611227576001935061122c565b600093505b50505090565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600d600160038110151561126557fe5b0160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600d60026003811015156112b657fe5b0160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600360006101000a81548160ff021916908315150217905550611319611330565b6002601081905550610e1042016011819055505b50565b600060005b6003821015611393575b600381101561138557600060048360038110151561135957fe5b6003020160005b508260038110151561136e57fe5b0160005b50819055505b808060010191505061133f565b5b8180600101925050611335565b5b5050565b610120604051908101604052806003905b6113b16113db565b8152602001906001900390816113a95790505090565b602060405190810160405280600081525090565b6060604051908101604052806003905b60008152602001906001900390816113eb57905050905600a165627a7a723058201c3810e9ddb0e11a7afa600bc35038b8d8cf5eb90b0ca47969d1ffec4e9a8c820029',
		//      gas: '4700000'
		//    }, function (e, contract){
		//     if (typeof contract.address !== 'undefined') {
		//          console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
		// 				 scheme.challenge({from: web3.eth.accounts[1], value: web3.toWei(10, "ether"), gas: 999999}, function(error, result) {
		// 					 console.log("RESULT1 " + scheme.checkInGame());
		// 					 scheme.play(1, 1, {from: web3.eth.accounts[1], gas: 999999}, function(error, result) {
		// 						 console.log("ERROR " + error);
		// 						 console.log("RESULT " + result);
		// 						 console.log("BOARD " + scheme.showBoard());
		// 					 })
		// 				 });
		//     }
		//  });
    if (req.user.isAdmin) {
      database.getContracts(req.user.id, function(err, contracts) {
        if (err == -1) {
          req.flash('error', 'Error while loading list of current contracts.');
        }
        res.render('admin-home', { contracts: contracts, flash: req.flash(), user: req.user, title: 'Citadel' });
      });
    }
    else {
      database.getFiles(req.user.id, function(err, files) {
        if (err == -1) {
          req.flash('error', 'Error while loading list of previously requested files.');
        }
        res.render('home', { files: files, flash: req.flash(), user: req.user, title: 'Citadel'});
      });
    }
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

  /* GET Request Page */
  router.get('/request', function(req, res, next) {
    res.render('request', { title: 'Citadel'});
  })

  /* GET Request Page */
  router.get('/', function(req, res, next) {
    res.render('request', { title: 'Citadel'});
  })

  /* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('signup',{message: req.flash('message')});
	});

	router.get('/createdoc', function(req,res){
		res.render('createdoc');
	})

	router.post('/downloadHistory', function(req,res) {
		var contract_address = req.body.address;
		//TODO: Insert code to download history from the contract and return as string
		var data = "";
		res.send(data, 200);
	})

  /* Handle request POST*/
  router.post('/requestAccess', function(req, res) {
    database.addFile(req.user.id, req.body.name, req.body.filename, function(err, file) {
      if (err == -1) { //General error
        req.flash('error', 'Sorry, an error occured while trying to request the file.');
      } else if (err == 1) { //File already exists error
        req.flash('error', 'The file with this hash has already been requested by you.');
      } else {
        req.flash('message', 'You have requested File "%s" with hash "%s"', file.name, file.hash);
      }
      //TODO: insert code to connect to contract to add transaction for request
			//TODO: insert watch code. Once blockchain updates with this request, put this stuff in callback.
			var document_id = file.hash;
			var user_id = req.user._id;
			database.getDocument(user_id, document_id, function(err, document) {
				if(err == -1) {
					//TODO: insert code to contract to add transaction for response (NEGATIVE)
					database.changeFile(file._id, false, function(err, file) {
						res.redirect('/home');
					});
				} else {
					var hash = hashCode(document.content);
					//TODO: insert code to contract to add transaction for response (POSITIVE)
					database.changeFile(file._id, err == 1, function(err, file) {
						res.redirect('/home');
					});
				}
			});
    })
  });

	router.post('/downloadFile', function(req, res) {
		database.getDocument(req.user._id, req.body.file_id, function(err, document) {
			res.send(document);
		});
	});

	router.post('/clearFile', function(req, res) {
		database.deleteFile(req.body.file_id, function() {
			res.redirect('/home');
		});
	});

  /* Handle contract add POST*/
  router.post('/contract_add', function(req, res) {
    database.addContract(req.user.id, req.body.name, req.body.ether, function(err, contract) {
      if (err == -1) { //General error
        req.flash('error', 'Sorry, an error occured while trying to create the contract.');
      } else if (err == 1) { //File already exists error
        req.flash('error', 'The contract with this address already exists.');
      } else {
        req.flash('message', 'You have created Contract "%s" with address "%s"', contract.name, contract.address);
      }
      //TODO: insert code to create new contract in the database function
      res.redirect('/home');
    })
  });

	router.post('/createDoc', function(req,res) {
		database.addDocument(req.body.name, req.body.content, req.body.access.split(","), function(err, document){
			res.send(document);
		});
	});

  /* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	return router;
}
