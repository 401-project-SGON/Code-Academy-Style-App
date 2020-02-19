
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
});

users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5);

});



users.statics.authenticateBasic = function (user, pass) {
  let query = { username: user };
  return this.findOne(query)
    .then(user => user && user.comparePassword(pass))
    .catch(error => { throw error; });
};

users.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

users.methods.generateToken = function (user) {
  let token = jwt.sign({ username: user.username }, process.env.SECRET, { expiresIn: 60 * 15 });
  console.log('token genrated: ', token);

  return token;
};

users.statics.verifyToken = async function (token) {

  let tokenObject = jwt.verify(token, process.env.SECRET);
  console.log('tokenObject : ', tokenObject);
  return this.findOne({ username: tokenObject.username });

};

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
      return this.create({ username, password, email });
    });
};

module.exports = mongoose.model('users', users);