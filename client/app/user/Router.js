'use strict';

var Router = require('ampersand-router');
var React = require('react');
var log = require('loglevel');
var dispatcher = require('../dispatcher');
var store = require('../store');
var urls = require('../urls');
var UserDetail = require('./UserDetail.jsx');

var Router = Router.extend({
  routes: {
    'user/:id/': 'detail',
  },

  detail: function(id) {
    log.info('detail');
    var user = store.find('users', urls.get('api:user:detail', id));
    return dispatcher.small({
      'animation': 'fade',
      'navLevel': 25,
      'title': user.name,
      'back': 'history',
      'main': React.createElement(UserDetail, {'user': user})
    }).medium({
      'main': React.createElement(UserDetail, {'user': user})
    }).large({
      'list': React.createElement(UserDetail, {'user': user})
    }).render();
  }
});

module.exports = Router;
