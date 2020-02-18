
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},

});

users.pre('save', async function() {

  this.password = await bcrypt.hash(this.password, 5);

});



users.statics.authenticateBasic = function(user, pass) {
  let query = {username:user};
  return this.findOne(query)
    .then( user => user && user.comparePassword(pass) )
    .catch(error => {throw error;});
};

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

users.statics.generateToken = function(user) {

// note that token expire in 15 min 

  let token = jwt.sign({ username: user.username}, process.env.SECRET, { expiresIn: 60 * 15});
  console.log('token genrated: ', token);

  return token;
};

users.statics.verifyToken = async function(token) {

  let tokenObject = jwt.verify(token, process.env.SECRET);
  console.log('tokenObject : ',tokenObject );
  return this.findOne({username:tokenObject.username});

};

module.exports = mongoose.model('users', users);