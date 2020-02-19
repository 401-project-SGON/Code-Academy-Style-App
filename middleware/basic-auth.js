const base64 = require('base-64');
const User = require('../users.js');


module.exports = (req, res, next) => {

  if(!req.headers.authorization) { next('invalid login'); return; }

  let basic = req.headers.authorization.split(' ').pop();
  console.log('req.headers.authorization:', req.headers.authorization);
  console.log('basic:', basic);

  let [user, pass] = base64.decode(basic).split(':');

  console.log('decoded user/pw', [user, pass]);

  User.authenticateBasic(user, pass)
    .then(validUser => {
      console.log('validUser : ', validUser);
      req.token = User.generateToken(validUser);
      console.log('token:', req.token);
      next();
    }).catch( err => next('invalid login'));
};