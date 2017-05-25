var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/express-mongoose-lesson-starter');

var User = require('../models/user');
// var Item = require('../models/item');

// Use native promises
mongoose.Promise = global.Promise;

// First we clear the database of existing users and items.
// Item.remove({}, function(err){
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
//   items: [{name: "Bike maintenance"}]
});

// save the users
clark.save(function(err) {
  if (err) console.log(err);

  console.log('User created!');
});
