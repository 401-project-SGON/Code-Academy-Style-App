/* eslint-disable strict */
'use strict';

require('dotenv').config();
const server = require('./lib/server.js');
const mongoose = require('mongoose');

console.log('here');

const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);



server.start(process.env.PORT);