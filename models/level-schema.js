const mongoose = require('mongoose');
require('./qSchema.js')
const level = mongoose.Schema({

  levelName: { type: String, required: true },
  difficulty:{ type: String, required: true },
  course: { type: String, required: true },

},
{ toObject: { virtuals: true }, toJSON: { virtuals: true },}
);


level.virtual('subjects', {

  ref: 'question',
  localField: 'levelName',
  foreignField: 'level',
  justOne: false,

});

level.pre('find', function() {

    try {
      this.populate('subjects');
    } catch(e) {
      console.error(e);
    }
  });



module.exports = mongoose.model('level', level);