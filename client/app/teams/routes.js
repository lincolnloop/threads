'use strict';

var store = require('../store');
var TopNav = require('../components/TopNav.jsx');
var OrganizationList = require('./organization-list.jsx');
var TeamDetailView = require('./detail.jsx');
var teamUtils = require('./utils');

var routes = {
  'list': function() {
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

    return {
      'content': contentView,
      'topNav': navView,
      'navLevel': 0
    };
  },

  'detail': function(teamSlug) {
    var team = store.find('teams', {'slug': teamSlug});
    // content > team discussion list view
    // TODO: We need to bootstrap teams on load
    var contentView = TeamDetailView({
      'team': team,
      'key': teamSlug
    });
    var navView = TopNav({
      'title': team.name,
      'backLink': '/'
    });

    return {
      'content': contentView,
      'topNav': navView,
      'navLevel': 5
    };
  }
};

module.exports = routes;
