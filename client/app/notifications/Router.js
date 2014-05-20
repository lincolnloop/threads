'use strict';

var Backbone = require('backbone');
var dispatcher = require('../dispatcher');
var NotificationList = require('./NotificationList.jsx');

var TeamRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    'notifications/': 'list',
  },

  list: function() {

    return dispatcher.render({
        'navLevel': 25,
        'title': 'Notifications',
        'back': 'history'
      }, NotificationList()
    );
  }
});

module.exports = TeamRouter;
