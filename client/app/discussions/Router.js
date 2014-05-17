'use strict';

var Backbone = require('backbone');
var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');
var dispatcher = require('../dispatcher');
var DiscussionDetailView = require('./DiscussionDetail.jsx');
var DiscussionCreateView = require('./DiscussionCreate.jsx');

var DiscussionRouter = Backbone.Router.extend({

  routes: {
    'discussion/create/:teamSlug/': 'create',
    ':teamSlug/:discussionId/:discussionSlug/': 'discussion:detail',
    ':teamSlug/:discussionId/:discussionSlug/#:messageId': 'discussion:detail'
  },

  create: function(teamSlug) {
    var team = store.find('teams', {'slug': teamSlug});

    return dispatcher.render(
      DiscussionCreateView({
        'team': team,
        'key': 'create-' + team.slug,
        'navLevel': 10
      })
    );
  },

  'detail': function(teamSlug, discussionId) {
    log.info('DiscussionRouter:detail');
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });

    return dispatcher.render(
      DiscussionDetailView({
        'team': team.url,
        'discussion': discussionUrl,
        'key': 'discussion-detail' + discussionUrl,
        'navLevel': 15
      })
    );
  }
});

module.exports = DiscussionRouter;
