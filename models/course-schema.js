const mongoose = require('mongoose');
require('./level-schema.js')
const course = mongoose.Schema({

  courseName: { type: String, required: true },
},
{ toObject: { virtuals: true }, toJSON: { virtuals: true },}
);


course.virtual('levels', {

  ref: 'level',
  localField: 'courseName',
  foreignField: 'course',
  justOne: false,

});


course.pre('find', function() {

    try {
      this.populate('levels');
    } catch(e) {
      console.error(e);
    }
  });


module.exports = mongoose.model('course', course);