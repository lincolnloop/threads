'use strict';

var store = require('../store');
var urls = require('../urls');
var TopNav = require('../components/TopNav.jsx');
var DiscussionDetailView = require('./DiscussionDetail.jsx');
var DiscussionCreateView = require('./DiscussionCreate.jsx');

var routes = {
  'create': function(teamSlug) {
    var team = store.find('teams', {'slug': teamSlug});
    // content > create view
    var contentView = DiscussionCreateView({
      'team': team.url,
      'key': 'create-' + team.slug
    });
    var navView = TopNav({
      'title': team.name,
      'team': team,
      'backLink': urls.get('team:detail', {'slug': teamSlug})
    });

    return {
      'content': contentView,
      'topNav': navView,
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

    return {
      'content': contentView,
      'topNav': navView,
      'navLevel': 15
    };
  }
};

module.exports = routes;
