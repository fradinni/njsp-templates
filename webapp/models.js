var m         = require('mongoose'),
    Schema    = m.Schema;

//
// User model
//
var UserSchema = Schema({
  openId: {type:String, unique: true},
  infos: Schema.Types.Mixed,
  email: String,
  dateCreated: { type: Date, default: Date.now }
});



//
// Exports models
//
module.exports = function(mongoose) {
  return {
    User:   mongoose.model('User', UserSchema)
  };
};