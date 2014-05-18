'use strict';

var Backbone = require('backbone');
var dispatcher = require('../dispatcher');
var store = require('../store');
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

    return dispatcher.render(
      OrganizationList({
        'organizations': organizations,
        'navLevel': 0
      })
    );
  },

  detail: function(teamSlug) {
    // fetch data
    store.get('discussions', {'team__slug': teamSlug}).then(function(response) {
      // TODO: Error handling
      var team = store.find('teams', {'slug': teamSlug});
      var discussions = response.results;
      
      return dispatcher.render(
        TeamDetailView({
          'team': team,
          'key': teamSlug,
          'discussions': discussions,
          'navLevel': 5
        })
      );
    });
  }
});

module.exports = TeamRouter;