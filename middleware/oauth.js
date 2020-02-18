/* eslint-disable camelcase */
/* eslint-disable strict */
'use strict';

const superagent = require('superagent');
const Users = require('../users.js');
require('dotenv').config();

const authorize = (req) => {
  let code = req.query.code;
  console.log('(1) CODE:', code);

  return superagent.post('https://www.googleapis.com/oauth2/v4/token') // this url from google documentation .post to send request
    .type('form')
    .send({ // headers of the request
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIEN_SECRET,
      redirect_uri: `http://localhost:3000/oauth`,
      grant_type: 'authorization_code',
    })
    .then( response => {
      let id_token = response.body.id_token;
      console.log('(2) ACCESS TOKEN:', response.body);
      return id_token;
    })
    .then(token => {
      return superagent.post(`https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${token}`)
        .then( response => {
          let user = response.body;
          user.access_token = token;
          console.log('(3) GOOGLEUSER', user);
          return user;
        });
    })
    .then(oauthUser => {
      console.log('(4) CREATE ACCOUNT');
      return Users.createFromOauth(oauthUser.email);
    })
    .then(actualRealUser => {
      console.log('(5) ALMOST ...', actualRealUser);
      return actualRealUser.generateToken(actualRealUser.email);
    })
    .catch(error => console.error(error));
};

module.exports = {authorize};