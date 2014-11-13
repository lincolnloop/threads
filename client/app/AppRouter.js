'use strict';

var Router = require('ampersand-router');

var AppRouter = Router.extend({
  /*
   * Main App Router
   * No routes are handled here directly, 
   * but on app routers initialized on index.js instead
  */
});

module.exports = new AppRouter();
