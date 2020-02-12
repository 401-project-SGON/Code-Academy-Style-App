const express = require('express');

const basicAuth = require('../middleware/basic-auth.js');
const oauth = require('../middleware/oauth.js');
const User = require('../users.js');
const mongoose = require('mongoose')

// let bearerAuth = require('../middleware/bearer-auth-middleware.js');

// eslint-disable-next-line new-cap
const router = express.Router();


router.post('/signup', (req, res) => {
  // hash the pass from req body then save
// create new user and save it in databsase
  new User(req.body).save()
    .then(userIn => {
      let token = User.generateToken(userIn);
      res.status(200).send(token);
    });
});

router.post('/signin', basicAuth ,(req, res) => {

  // creat token and append to req by basicAuth middleware

  res.status(200).json(req.token);
});

router.get('/users', basicAuth, (req, res) => {

  // show all users from database
  User.find().then(data=>{
    res.status(200).json(data);
  })


});

let data= require('../data/data.json')


function getModel(req, res, next) {
  let model = req.params.model;

  switch(model) {
  case 'categories':
    req.model = categories;
    next();
    return;
  case 'products':
    req.model = products;
    next();
    return;
  default:
    next('invalid model');
    return;
  }
}

router.param('model', getModel);

router.get('/data/:cName/:level/:q',(req,res)=>{

  // dir= req.params
//   console.log('dir : ', dir);
// if(dir.cName.level.q){
//   data3 = data.courses.cName.level.q
// }
let a = req.params.cName
  console.log('a : ', a);
  console.log('data.courses.a : ', data.courses.a);
  res.status(200).json(data.courses.a)
})

// router.get('/oauth', oauth ,(req, res) => {
//   res.status(200).send(req.token);

// });

// router.get('/secret', bearerAuth, (req, res) => {
//   res.status(200).json(req.user);
// });

module.exports = router;