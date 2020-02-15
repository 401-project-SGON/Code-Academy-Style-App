const mongoose = require('mongoose');
require('./level-schema.js')
const question = mongoose.Schema({

  question: { type: String, required: true },
  answer: { type: String, required: true },
  level:{type:String, required:true},
},
);




module.exports = mongoose.model('question', question);