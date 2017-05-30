var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/drinkable');

var User = require('../models/user');
var Beverages = require('../models/beverage');

// Use native promises
mongoose.Promise = global.Promise;

User.remove({}, function (err) {
  console.log(err);
});
// First we clear the database of existing users and beverages.
Beverages.remove({}, function (err) {
  console.log(err);
});