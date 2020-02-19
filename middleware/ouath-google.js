/* eslint-disable strict */

'use strict';

const {google} = require('googleapis');

const blogger = google.blogger({
  version: 'v3',
  auth: 'api',
});

const params = {
  blogId: '3213900',
};

// eslint-disable-next-line no-unused-vars
blogger.blogs.get(params, (err,res) => {
  if (err) {
    console.error(err);
    throw err;
  }
});