const schema = require('./feedback-scema.js');
const dataModel = require('./model.js');

class Feedback extends dataModel {}

module.exports = new Feedback(schema);