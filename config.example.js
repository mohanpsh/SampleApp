'use strict';

exports.hostname = process.env.hostname || 'localhost';
exports.port = process.env.PORT || 3000;
exports.mongodb = {
  uri: '' // Enter your mongo db url
};
