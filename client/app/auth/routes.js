'use strict';

var log = require('loglevel');
var store = require('../store');
var TopNav = require('../components/TopNav.jsx');
var SignInView = require('./SignIn.jsx');

var routes = {
  'signIn': function() {
    log.info('auth:signIn');
    // content > sign in view
    var contentView = SignInView({
      'success': store.fetch.bind(store)
    });
    var navView = TopNav({
      'title': 'Sign In'
    });

    return {
      'content': contentView,
      'topNav': navView,
      'navLevel': 0
    };
  },

  'signOut': function() {
    log.info('auth:signOut');
  }
};

module.exports = routes;
