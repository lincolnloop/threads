'use strict';

var Backbone = require('backbone');
var log = require('loglevel');
var dispatcher = require('../dispatcher');
var store = require('../store');
var Search = require('./Search.jsx');

var Router = Backbone.Router.extend({
  routes: {
    'search/': 'search',
    ':team/search/': 'search'
  },

  search: function() {
    log.info('search');
    return dispatcher.render({
        'animation': 'fade',
        'navLevel': 25,
        'title': 'Search Threads',
        'back': '/'
      }, Search()
    );
  }
});

module.exports = Router;
