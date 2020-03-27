const mongoose = require('mongoose');
require('./level-schema.js')
const question = mongoose.Schema({

  subject: { type: String, required: true },
  example: { type: String, required: true },
  explain: { type: String, required: true },
  level:{type:String, required:true},
},
);




module.exports = mongoose.model('question', question);