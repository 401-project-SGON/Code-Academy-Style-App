/* eslint-disable camelcase */
/* eslint-disable strict */
'use strict';
const superagent = require('superagent');
const Users = require('../../users.js');
require('dotenv').config();
const authorize = (req) => {
  let code = req.query.code;
  console.log('(1) CODE:', code);
  return superagent.post('https://www.googleapis.com/oauth2/v4/token') // this url from google documentation .post to send request
    .type('form')
    .send({
      // headers of the request
      code: code,
      client_id: process.env.CLIENT_ID3,
      client_secret: process.env.CLIEN_SECRET3,
      redirect_uri: `https://power-code-back-end.herokuapp.com/oauth`,
      grant_type: 'authorization_code',
    })
    .then(response => { // the response from the previous request is a token object {id_token, access_token, refresh_token}
      let id_token = response.body.id_token;
      console.log('(2) ACCESS TOKEN:', response.body);
      return id_token;
    })
    .then(token => { // token = id_token
      return superagent.post(`https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=${token}`)
        // this post request to get a valid user information using the id_token
        .then(response => {
          let user = response.body;
          user.access_token = token;
          console.log('(3) GOOGLEUSER', user);
          return user;
        });
    })
    .then(oauthUser => { // oauthuser = user from previous .then() block
      console.log('(4) CREATE ACCOUNT');
      return Users.createFromOauth(oauthUser.email); // this leads to the user model page
    })
    .then(actualRealUser => { // actualRealUser is your schema with google sign in information
      console.log('(5) ALMOST ...', actualRealUser);

      // let userSecInfo = {
      //   username: user.username,
      //   capabilities: capabilities[user.role],
      //   email:user.email,
      //   phone:user.phone,
      //   url:user.url
      // };
      let userInfo={
        username:actualRealUser.email,
        capabilities:'user',
        email:actualRealUser.email,
        phone:actualRealUser.phone,
        url:actualRealUser.url
      }
      let user = {username:actualRealUser.email}
      return Users.generateToken(userInfo); // this will give back a token contains just your email address
    })
    .catch(error => console.error(error));
};
module.exports = { authorize };

