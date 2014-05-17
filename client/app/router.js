'use strict';

var Backbone = require('backbone');

// --------------------
// routers
// --------------------
//var authRoutes = require('./auth/routes');
var TeamRouter = require('./teams/Router');
//var discussionRoutes = require('./discussions/routes');
//var messageRoutes = require('./messages/routes');

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
  },

  index: function() {
    log.info('AppRouter:list');
    // TODO
  }
});

module.exports = AppRouter;
