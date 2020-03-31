const express = require('express');
// cloudinary
const cloudinary = require('cloudinary')

const auth = require('../middleware/auth.js');
const User = require('../users.js');
const mongoose = require('mongoose')
// models
const Subject = require('../models/qModel')
const Course = require('../models/course-model.js') 
const Level = require('../models/level-model.js') 
const oauth = require('../middleware/oauth/oauth.js')
const formData = require('express-form-data')
const Feedback = require('../models/feedback-model.js')


// cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

// eslint-disable-next-line new-cap
const router = express.Router();
router.use(formData.parse())

router.post('/image', (req, res) => {
  console.log('req.files : ', req.files);
  const path = req.files[0].path
  console.log('path : ', path);
  cloudinary.uploader.upload(path)
    .then(image => res.status(200).json([image]))
})


////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// feedback
router.get('/feedback', (req, res) => {
  

  Feedback.get(req.params.id).then(data=>{
    res.status(200).json(data)
  })

});
router.post('/feedback', (req, res) => {
  
console.log('req.body : ', req.body);
  Feedback.create(req.body).then(data=>{
    res.status(201).json(data)
  })

});
router.delete('/feedback', (req, res) => {
  
  let msg = "item deleted"

  Feedback.delete(req.params.id).then(data=>{
    res.status(200).json(msg)
  })

});

///

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
router.post('/signin', auth() ,(req, res) => {
    // creat token and append to req by basicAuth middleware
  res.status(200).json(req.token);
});
router.get('/users', (req, res) => {
    // show all users from database
  User.find().then(data=>{
    res.status(200).json(data);
  })
});

router.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
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
    case 'subject':
      req.model = Subject;
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
router.post('/:model',create)
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
    res.status(201).json(data)
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




module.exports = router;