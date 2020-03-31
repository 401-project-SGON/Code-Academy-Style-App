
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('./roles.js')
dotenv.config();

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  role: {type: String, default:'user', enum: ['admin','editor','user']},
  email:{type:String,required:false,unique:false},
  phone:{type:String,required:false,unique:false},
  url:{type:String,required:false,unique:false}
});

users.pre('save', async function() {

  this.password = await bcrypt.hash(this.password, 5);
});


const capabilities = {
  admin: ['create','read','update','delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

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

let userSecInfo = {
  username: user.username,
  capabilities: capabilities[user.role],
  email:user.email,
  phone:user.phone,
  url:user.url
};

let token = jwt.sign(userSecInfo , process.env.SECRET);
console.log('token genrated: ', token);
return token;
};

users.statics.verifyToken = async function(token) {
  console.log('token : ', token);

  let tokenObject = jwt.verify(token, process.env.SECRET);
  console.log('tokenObject : ',tokenObject );
  return this.findOne({username:tokenObject.username});
};

users.methods.can = function(capability) {
  console.log('capability : ',capability );
  return capabilities[this.role].includes(capability);
};
// from oauth
users.statics.createFromOauth = function (email) {
  if (!email) { return Promise.reject('Validation Error'); }
  return this.findOne({ email })
    .then(user => {
      if (!user) { throw new Error('User Not Found'); }
      return user;
    })
    .catch(() => {
      console.log('Creating new user');
      let username = email;
      let password = 'none';
      let role = 'user'
      let email = email;
      let phone=''
      let url = ''
      return this.create({ username, password,phone,url,role });
    });
};

module.exports = mongoose.model('users', users);