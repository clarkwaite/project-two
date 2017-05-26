var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/drinkable');

var User = require('../models/user');
var Beverages = require('../models/beverage');

// Use native promises
mongoose.Promise = global.Promise;

// First we clear the database of existing users and beverages.
// Beverages.remove({}, function(err){
//   console.log(err);
// });

User.remove({}, function(err){
  console.log(err);
});

// create new users
var clark = new User({
  first_name: 'Clark',
  last_name: 'Waite',
  email: 'clarkwaite@gmail.com',
  beverages: [{name: "Bells Two Hearted", type: 'IPA', drinkDate: '04/26/17', rating: 100, drinkable: true, comments: 'Great beer!'}]
});

// save the users
clark.save(function(err) {
  if (err) console.log(err);

  console.log('User created!');
});
