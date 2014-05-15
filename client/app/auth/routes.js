'use strict';

var log = require('loglevel');
var Q = require('q');

var routes = {
  'signOut': function() {
    var deferred = Q.defer();
    log.info('auth:signOut');
    return deferred.promise;
  }
};

module.exports = routes;
