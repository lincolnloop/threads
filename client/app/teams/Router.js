'use strict';

var Backbone = require('backbone');
var log = require('loglevel');
var React = require('react');
var store = require('../store');
var urls = require('../urls');

// --------------------
// routers
// --------------------
//var authRoutes = require('./auth/routes');
//var teamRoutes = require('./teams/routes');
//var discussionRoutes = require('./discussions/routes');
//var messageRoutes = require('./messages/routes');

var TeamRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    '': 'list'
  },

  initialize: function() {
      // new TeamRouter();
  },

  list: function() {
    // TODO
    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);
    var contentView = '';

    if (organizations && organizations.length) {
      contentView = OrganizationList({
        organizations: organizations
      });
    }
    var navView = TopNav({
      'title': 'Threads'
    });

    deferred.resolve({
      'content': contentView,
      'topNav': navView,
      'navLevel': 0
    });
  },

  detail: function() {

  }
});

module.exports = TeamRouter;
