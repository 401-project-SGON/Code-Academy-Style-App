/* eslint-disable camelcase */
/* eslint-disable strict */
'use strict';

const superagent = require('superagent');
const Users = require('../users.js');
require('dotenv').config();

const authorize = (req) => {
  let code = req.query.code || '4/wgGE_Iwj3LaUfdQ89ICGwHnSAoKU53Iv0tIV3Pf90ZnPTv_urQx5VU4Egg_A8oIW9xTNtZPqmHelFLC5KrM6efo';
  console.log('(1) CODE:', code);

  return superagent.post('https://www.googleapis.com/oauth2/v4/token')
    .type('form')
    .send({
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIEN_SECRET,
      redirect_uri: `http://localhost:3000/oauth`,
      grant_type: 'authorization_code',
    })
    .then( response => {
      let access_token = response.body.access_token;
      console.log('(2) ACCESS TOKEN:', access_token);
      return access_token;
    })
    .then(token => {
      return superagent.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
        .set('Authorization', `Bearer ${token}`)
        .then( response => {
          let user = response.body;
          user.access_token = token;
          console.log('(3) GOOGLEUSER', user);
          return user;
        });
    })
    .then(oauthUser => {
      console.log('(4) CREATE ACCOUNT');
      return Users.createFromOAuth(oauthUser);
    })
    .then(actualRealUser => {
      console.log('(5) ALMOST ...', actualRealUser);
      return actualRealUser.generateToken();
    })
    .catch(error => error);


};

module.exports = {authorize};