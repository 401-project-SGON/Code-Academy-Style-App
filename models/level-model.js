const schema = require('./level-schema.js');
const dataModel = require('./model.js');

class Level extends dataModel {}

module.exports = new Level(schema);