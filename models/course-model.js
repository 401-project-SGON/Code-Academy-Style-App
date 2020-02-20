const schema = require('./course-schema.js');
const dataModel = require('./model.js');

class Course extends dataModel {}

module.exports = new Course(schema);