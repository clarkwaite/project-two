var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Beverages = require('../models/beverage');

/* GET home page. */
router.get('/', function(request, response, next) {
     response.redirect('/users/');
});

module.exports = router;
