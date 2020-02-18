
const schema = require('./qSchema.js');
const dataModel = require('./model.js');

class Quastion extends dataModel {}

module.exports = new Quastion(schema);