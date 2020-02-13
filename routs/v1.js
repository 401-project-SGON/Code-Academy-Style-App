const express = require('express');

const basicAuth = require('../middleware/basic-auth.js');
const oauth = require('../middleware/oauth.js');
const User = require('../users.js');
const mongoose = require('mongoose')
const Quastion = require('../models/qModel')
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


// function getModel(req, res, next) {
//   let model = req.params.model;

//   switch(model) {
//   case 'categories':
//     req.model = categories;
//     next();
//     return;
//   case 'products':
//     req.model = products;
//     next();
//     return;
//   default:
//     next('invalid model');
//     return;
//   }
// }

// router.param('model', getModel);



router.get('/data',(req,res)=>{

  let question = {question:"what is js?",answer:"i dont know"}

Quastion.create(question).then(data=>{
  console.log('data : ', data);
})
  let q = Quastion.get().then(data=>{
    console.log('data : ', data);
  })
  console.log('q : ', q);
  res.status(200).json(data)
})
router.get('/data/:course',(req,res)=>{

  let a = req.params.course
  
  res.status(200).json(data.courses[a])
})

router.get('/data/:course/:level',(req,res)=>{
  console.log('req.params : ', req.params);

  let b = req.params.course

  let a = req.params.level
  
  res.status(200).json(data.courses[b][a])
})

router.get('/data/:course/:level/:q',(req,res)=>{
  console.log('req.params : ', req.params);

  let c = req.params.q
  let b = req.params.course

  let a = req.params.level
  
  res.status(200).json(data.courses[b][a][c])
})

router.get('/data/:course/:level/:q/:n',(req,res)=>{
  console.log('req.params : ', req.params);

  let d = req.params.n
  let c = req.params.q
  let b = req.params.course

  let a = req.params.level
  
  res.status(200).json(data.courses[b][a][c][d])
})
// router.get('/oauth', oauth ,(req, res) => {
//   res.status(200).send(req.token);

// });

// router.get('/secret', bearerAuth, (req, res) => {
//   res.status(200).json(req.user);
// });

module.exports = router;