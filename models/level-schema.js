const mongoose = require('mongoose');
require('./qSchema.js')
const level = mongoose.Schema({

  levelName: { type: String, required: true },
  course: { type: String, required: true },

},
{ toObject: { virtuals: true }, toJSON: { virtuals: true },}
);


level.virtual('questions', {

  ref: 'question',
  localField: 'levelName',
  foreignField: 'level',
  justOne: false,

});

level.pre('find', function() {

    try {
      this.populate('questions');
    } catch(e) {
      console.error(e);
    }
  });



module.exports = mongoose.model('level', level);