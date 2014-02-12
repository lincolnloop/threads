"use strict";

var _ = require('underscore');
var Backbone = require('backbone');

var AppRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on app/Main.jsx instead.
  */
  routes: {
    "": 'index',
    "sign-in": 'signIn',
    "sign-out": 'signOut',
    ":team/": 'team:detail',
    "discussion/create/:teamSlug/": 'team:create',
    ":teamSlug/:discussionId/:discussionSlug/": 'discussion:detail'
  }
});

module.exports = new AppRouter();
