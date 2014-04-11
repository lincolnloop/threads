'use strict';

var log = require('loglevel');
var store = require('../store');
var TopNav = require('../components/TopNav.jsx');
var SignInView = require('./sign-in.jsx');

var routes = {
  'signIn': function() {
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
    log.debug('main:signOut');
  }
};

module.exports = routes;
