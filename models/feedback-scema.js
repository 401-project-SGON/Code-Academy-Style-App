const mongoose = require('mongoose');
const feedback_collection = mongoose.Schema({

  feedback: { type: String, required: true },
  suggestions: { type: String, required: false },
  user:{ type: String, required: false }
 
},
);




module.exports = mongoose.model('feedback', feedback_collection);