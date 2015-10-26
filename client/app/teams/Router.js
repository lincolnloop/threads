'use strict';

var _ = require('underscore');
var Router = require('ampersand-router');
var log = require('loglevel');
var dispatcher = require('../dispatcher');
var store = require('../store');
var HeaderCreateDiscussion = require('./HeaderCreateDiscussion.jsx');
var HeaderReloadTeams = require('./HeaderReloadTeams.jsx');
var OrganizationList = require('./OrganizationList.jsx');
var TeamDetailView = require('./TeamDetail.jsx');

var TeamRouter = Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    '': 'list',
    ':team/': 'detail'
  },

  list: function() {
    log.info('team:list');
    return dispatcher.small({
      'navLevel': 0,
      'title': 'Threads',
      'back': null,
      'main': OrganizationList(),
      'headerContextView': HeaderReloadTeams()
    }).medium().large().render();
  },

  detail: function(teamSlug) {
    log.info('team:detail');
    // fetch data
    var team = store.find('teams', {'slug': teamSlug});
    if (!team) {
      return;
    }
    // views
    var viewOptions = {
      'team': team,
      'key': teamSlug
    };
    var headerContextView = HeaderCreateDiscussion({
      'team_slug': teamSlug
    });

    return dispatcher.small({
      'navLevel': 5,
      'title': team.name,
      'back': '/',
      'main': TeamDetailView(viewOptions),
      'headerContextView': headerContextView
    }).medium({
      'team': team,
      'main': TeamDetailView(_.extend(viewOptions, {'loanimSelector': '.content-main'})),
      'headerContextView': headerContextView
    }).large({
      'team': team,
      'list': TeamDetailView(_.extend(viewOptions, {'loanimSelector': '.list-main'})),
      'headerContextView': headerContextView
    }).render();
  }
});

module.exports = TeamRouter;
