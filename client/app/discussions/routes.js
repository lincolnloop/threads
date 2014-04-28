'use strict';

var React = require('react');
var store = require('../store');
var urls = require('../urls');
var TopNav = require('../components/TopNav.jsx');
var DiscussionDetailView = require('./DiscussionDetail.jsx');
var DiscussionCreateView = require('./DiscussionCreate.jsx');

var routes = {
  'create': function(teamSlug) {
    var team = store.find('teams', {'slug': teamSlug});
    var backUrl = urls.get('team:detail', {'slug': teamSlug});
    // content > create view
    var contentView = DiscussionCreateView({
      'cancelLink': backUrl,
      'team': team.url,
      'key': 'create-' + team.slug
    });
    var navView = TopNav({
      'title': team.name,
      'team': team,
      'backLink': backUrl
    });
    var bottomNav = React.DOM.nav({'id': 'bottom-nav'},
      React.DOM.a({
        'href': '/',
        'children': 'Dashboard'
      })
    );

    return {
      'content': contentView,
      'topNav': navView,
      'bottomNav': bottomNav,
      'navLevel': 10
    };
  },

  'detail': function(teamSlug, discussionId) {
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    // content > discussion detail view
    var contentView = DiscussionDetailView({
      'team': team,
      'discussion': discussionUrl,
      'key': 'discussion-detail' + discussionUrl
    });
    var navView = TopNav({
      'title': team.name,
      'team': team,
      'backLink': urls.get('team:detail', {'slug': teamSlug})
    });
    var bottomNav = React.DOM.nav({'id': 'bottom-nav'},
      React.DOM.a({
        'href': '/',
        'children': 'Dashboard'
      })
    );

    return {
      'content': contentView,
      'topNav': navView,
      'bottomNav': bottomNav,
      'navLevel': 15
    };
  }
};

module.exports = routes;
