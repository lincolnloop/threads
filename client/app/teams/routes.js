'use strict';

var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');
var React = require('react');
var TopNav = require('../components/TopNav.jsx');
var OrganizationList = require('./OrganizationList.jsx');
var TeamDetailView = require('./TeamDetail.jsx');
var teamUtils = require('./utils');

var routes = {
  'list': function() {
    log.info('team:list');
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
    log.info('team:detail');
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
    var bottomNav = React.DOM.nav({'id': 'bottom-nav'},
      React.DOM.a({
        'href': urls.get('discussion:create:team', {'team_slug': teamSlug}),
        'children': 'New Discussion'
      })
    );
    return {
      'content': contentView,
      'topNav': navView,
      'bottomNav': bottomNav,
      'navLevel': 5
    };
  }
};

module.exports = routes;
