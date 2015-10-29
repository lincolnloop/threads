'use strict';

var React = require('react');
var Router = require('ampersand-router');
var log = require('loglevel');
var dispatcher = require('../dispatcher');
var store = require('../store');
var HeaderReloadTeams = require('./HeaderReloadTeams.jsx');
var OrganizationList = require('./OrganizationList.jsx');

var TeamRouter = Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    '': 'list'
  },

  list: function() {
    log.info('team:list');
    return dispatcher.small({
      'navLevel': 0,
      'title': 'Threads',
      'back': null,
      'main': React.createElement(OrganizationList),
      'headerContextView': React.createElement(HeaderReloadTeams)
    }).medium().large().render();
  }
});

module.exports = TeamRouter;
