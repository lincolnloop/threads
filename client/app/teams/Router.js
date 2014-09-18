'use strict';

var Backbone = require('backbone');
var log = require('loglevel');
var dispatcher = require('../dispatcher');
var store = require('../store');
var HeaderCreateDiscussion = require('./HeaderCreateDiscussion.jsx');
var HeaderReloadTeams = require('./HeaderReloadTeams.jsx');
var OrganizationList = require('./OrganizationList.jsx');
var TeamDetailView = require('./TeamDetail.jsx');
var teamUtils = require('./utils');

var TeamRouter = Backbone.Router.extend({
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
    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);

    var organizationsListView = OrganizationList({
      'organizations': organizations
    });

    return dispatcher.small({
      'navLevel': 0,
      'title': 'Threads',
      'back': null,
      'main': organizationsListView,
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
    var discussionListView = TeamDetailView({
      'team': team,
      'key': teamSlug
    });
    var headerContextView = HeaderCreateDiscussion({
      'team_slug': teamSlug
    });

    return dispatcher.small({
      'navLevel': 5,
      'title': team.name,
      'back': '/',
      'main': discussionListView,
      'headerContextView': headerContextView
    }).medium({
      'main': discussionListView
    }).large({
      'list': discussionListView
    }).render();
  }
});

module.exports = TeamRouter;
