const mongoose = require('mongoose');

const question = mongoose.Schema({

  question: { type: String, required: true },
  answer: { type: String, required: true },
 
}
);


module.exports = mongoose.model('question', question);