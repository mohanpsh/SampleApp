'use strict';

exports = module.exports = function(app, mongoose) {
  //then regular docs
  require('./schema/Product')(app, mongoose);
  require('./schema/Category')(app, mongoose);
};
