'use strict';

var log = require('loglevel');
var Backbone = require('backbone');

// --------------------
// routers
// --------------------
//var authRoutes = require('./auth/routes');
var TeamRouter = require('./teams/Router');
var DiscussionRouter = require('./discussions/Router');
var MessageRouter = require('./messages/Router');
var NotificationRouter = require('./notifications/Router');

var AppRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    '': 'index'
  },

  initialize: function() {
    // instantiate apps routers
    new TeamRouter();
    new DiscussionRouter();
    new MessageRouter();
    new NotificationRouter();
  },

  index: function() {
    log.info('AppRouter:list');
    // TODO
  }
});

module.exports = AppRouter;