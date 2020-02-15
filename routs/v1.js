const express = require('express');

const basicAuth = require('../middleware/basic-auth.js');
const oauth = require('../middleware/oauth.js');
const User = require('../users.js');
const mongoose = require('mongoose')
const Quastion = require('../models/qModel')

const Course = require('../models/course-model.js') 
const Level = require('../models/level-model.js') 

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




// router.get('/data',(req,res)=>{

//   let question = {question:"what is js?",answer:"i dont know"}

// Quastion.create(question).then(data=>{
//   console.log('data : ', data);
// })
//   let q = Quastion.get().then(data=>{
//     console.log('data : ', data);
//   })
//   console.log('q : ', q);
//   res.status(200).json(data)
// })

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



router.post('/addCourse',(req,res)=>{

  let course = {courseName: "javaScript"}
  let course2 = {courseName: "python"}

  Course.create(course);
  Course.create(course2);
  res.status(200).send('ok')

})

router.post('/addLevel',(req,res)=>{

  let level = {levelName: "level-1", course:"javaScript"}
  let level2 = {levelName: "level-2", course:"javaScript"}

  Level.create(level);
  Level.create(level2);
  res.status(200).send('ok')

})

router.post('/addQ',(req,res)=>{

  let question = {question: "what is javaSCRIPT", answer:"I HAVE NO IDEA", level:"level-1"}
  let question2 = {question: "HOW ARE YOU??", answer:"good", level:"level-1"}


  Quastion.create(question);
  Quastion.create(question2);
  res.status(200).send('ok')
})

router.get('/show',(req,res)=>{
  Course.get().then(data=>{
    res.status(200).json(data)
  })
})

router.get('/showL',(req,res)=>{
  Level.get().then(data=>{
    res.status(200).json(data)
  })
})




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

router.param('model', getModel);


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