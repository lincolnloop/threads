'use strict';

var log = require('loglevel');

var routes = {
  'signOut': function() {
    log.info('auth:signOut');
  }
};

module.exports = routes;
