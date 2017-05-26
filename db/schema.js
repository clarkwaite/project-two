var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Use native promises
mongoose.Promise = global.Promise;

var BeverageSchema = new Schema({
  name: String,
  type: String,
  drinkDate: String,
  rating: Number,
  drinkable: Boolean,
  comments: String
});

BeverageSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: { type: String, required: true, unique: true },
  created_at: Date,
  updated_at: Date,
  beverages: [BeverageSchema]
});

UserSchema.pre('save', function(next){
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});


var UserModel = mongoose.model("User", UserSchema);
var BeverageModel = mongoose.model("Item", BeverageSchema);

module.exports = {
  User: UserModel,
  Beverage: BeverageModel
};
