/* eslint-disable strict */
'use strict';
const express = require('express');
const morgan = require('morgan');

// custom middleware
const notFound = require('../middleware/notfound.js');
const errorHandler = require('../middleware/error.js');

// epress app
const app = express();
app.use(express.json());
app.use(express.static('./public'));

// custom routes
const apiRouter = require('../routs/v1.js');

// app uses
app.use(morgan('dev'));
app.use(apiRouter);
app.use('*',notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3333;
    app.listen(PORT, () => console.log('server up:', PORT));
  },
};