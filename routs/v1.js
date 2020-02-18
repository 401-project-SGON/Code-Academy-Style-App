const express = require('express');
const auth = require('../middleware/auth.js');
const User = require('../users.js');
const mongoose = require('mongoose')
// models
const Quastion = require('../models/qModel')
const Course = require('../models/course-model.js') 
const Level = require('../models/level-model.js') 


// eslint-disable-next-line new-cap
const router = express.Router();


//
router.get('/data', (req, res) => {
  
     res.status(200).json({ "message": 'Hello World' });

});

// auth routes 
router.post('/signup', (req, res) => {
   // hash the pass from req body then save
   // create new user and save it in databsase
  new User(req.body).save()
    .then(userIn => {
      let token = User.generateToken(userIn);
      res.status(200).send(token);
    });
});
router.post('/signin', auth ,(req, res) => {
    // creat token and append to req by basicAuth middleware
  res.status(200).json(req.token);
});
router.get('/users', auth, (req, res) => {
    // show all users from database
  User.find().then(data=>{
    res.status(200).json(data);
  })
});

// load json file
// let data= require('../data/data.json')

// get the model by this middleware and add the model (/:model) to the req.model
function getModel(req, res, next) {
  let model = req.params.model;

  switch(model) {
  case 'course':
    req.model = Course;
    next();
    return;
  case 'level':
    req.model = Level;
    next();
    return;
    case 'quastion':
      req.model = Quastion;
      next();
      return;
  default:
    next('invalid model');
    return;
  }
}
// middleware stand-alone route
router.param('model', getModel);

// main routes for get create update delete 
router.get('/:model/:id',getOne)
router.get('/:model',getAll)
router.post('/:model',auth('create'),create)
router.put('/:model/:id',update)
router.delete('/:model/:id',deleteOne)


function getOne(req,res,next){

  req.model.get(req.params.id).then(data=>{
    res.status(200).json(data)
  })
}
function getAll(req,res,next){

  req.model.get().then(data=>{
    res.status(200).json(data)
  })
}
function create(req,res,next){

  req.model.create(req.body).then(data=>{
    res.status(200).json(data)
  })
}
function update(req,res,next){

  req.model.update(req.params.id,req.body).then(data=>{
    res.status(200).json(data)
  })
}
function deleteOne(req,res,next){

  let mesg = "item deleted"
  req.model.delete(req.params.id).then(data=>{
    res.status(200).json(mesg)
  })
}



// router.get('/oauth', oauth ,(req, res) => {
//   res.status(200).send(req.token);

// });

// router.get('/secret', bearerAuth, (req, res) => {
//   res.status(200).json(req.user);
// });

module.exports = router;