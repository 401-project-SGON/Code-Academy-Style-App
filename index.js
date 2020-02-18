
const server = require('./lib/server.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Start up DB Server
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);



server.start(process.env.PORT);