'use strict';

var Backbone = require('backbone');
var log = require('loglevel');
var dispatcher = require('../dispatcher');
var Search = require('./Search.jsx');

var Router = Backbone.Router.extend({
  routes: {
    'search/': 'search',
    ':team/search/': 'search'
  },

  search: function() {
    log.info('search');
    return dispatcher.small({
        'animation': 'fade',
        'navLevel': 25,
        'title': 'Search Threads',
        'back': '/',
        'main': Search()
      }).medium({
        'main': Search()
      }).large({
        'list': Search()
      }).render();
  }
});

module.exports = Router;
