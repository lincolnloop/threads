'use strict';

var log = require('loglevel');
var store = require('../store');
var TopNav = require('../components/TopNav.jsx');
var SignInView = require('./SignIn.jsx');

var routes = {
  'signOut': function() {
    log.info('auth:signOut');
  }
};

module.exports = routes;
