const mongoose = require('mongoose');
require('./level-schema.js')
const course = mongoose.Schema({
  overview: { type: String, required: true },
  courseName: { type: String, required: true },
  questions: { type: Object, required: true },

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