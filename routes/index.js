var express = require('express');
var database = require('../public/javascripts/database.js');
var router = express.Router();

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
        res.render('home', { files: files, flash: req.flash(), user: req.user, title: 'Citadel' });
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
      res.redirect('/home');
    })
  })

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
  })

  /* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	return router;
}
