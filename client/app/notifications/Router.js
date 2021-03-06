'use strict';

var Router = require('ampersand-router');
var React = require('react');
var dispatcher = require('../dispatcher');
var NotificationList = require('./NotificationList.jsx');

var TeamRouter = Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    'notifications/': 'list',
  },

  list: function() {
    var view = React.createElement(NotificationList);
    return dispatcher.compact({
      'main': view
    }).full({
      'list': view
    }).render();
  }
});

module.exports = TeamRouter;
