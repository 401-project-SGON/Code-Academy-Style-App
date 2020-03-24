
const server = require('./lib/server.js');
const chatServer = require('./lib/chat-server.js')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Start up DB Server
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

const options2 ={
  useNewUrlParser:true,
  useUnifiedTopology: true 

}

mongoose.connect(process.env.MONGODB_URI, options2);



server.start(process.env.PORT);
chatServer.start(process.env.PORT2)