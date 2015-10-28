'use strict';
var Alt = require('alt');
var Router = require('ampersand-router');

/*
 * Main App Router
 * No routes are handled here directly, 
 * but on app routers initialized on index.js instead
*/
var AppRouter = new Router();

// alt
AppRouter.alt = new Alt();

module.exports = AppRouter;
