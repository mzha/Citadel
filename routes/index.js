var express = require('express');
var router = express.Router();

/* GET pages */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Citadel'});
});

router.get('/request', function(req, res, next) {
  res.render('request', { title: 'Citadel'});
})

/* POST requests */
router.post('/requestAccess', function(req, res) {
  res.render('requested', {file: req.body.filename, title: 'Citadel'});
})

module.exports = router;
