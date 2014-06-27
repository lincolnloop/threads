'use strict';

var Backbone = require('backbone');
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
    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);

    return dispatcher.render({
        'navLevel': 0,
        'title': 'Threads',
        'back': null,
        'headerContextView': HeaderReloadTeams()
      }, OrganizationList({'organizations': organizations})
    );
  },

  detail: function(teamSlug) {
    // fetch data
    var team = store.find('teams', {'slug': teamSlug});
    if (!team) {
      return;
    }

    return dispatcher.render({
        'navLevel': 5,
        'title': team.name,
        'back': '/',
        'headerContextView': HeaderCreateDiscussion({
          'team_slug': teamSlug
        })
      }, 
      TeamDetailView({
        'team': team,
        'key': teamSlug
      })
    );
  }
});

module.exports = TeamRouter;
