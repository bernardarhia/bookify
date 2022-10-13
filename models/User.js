const {Schema, model} =  require('mongoose');

const userSchema = new Schema({
  username:{type: String, required:true}, 
  password: String,
  role :String
}, {timestamps:true});

const User = model('User', userSchema);
module.exports = User;