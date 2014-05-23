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
    ':teamSlug/:discussionId/:discussionSlug/': 'detail',
    ':teamSlug/:discussionId/:discussionSlug/#:messageId': 'detail'
  },

  create: function(teamSlug) {
    log.info('DiscussionRouter:detail');
    var team = store.find('teams', {'slug': teamSlug});
    var back = urls.get('team:detail', {'slug': teamSlug});
    return dispatcher.render({
        'navLevel': 10,
        'title': 'Create discussion',
        'back': back
      },
      DiscussionCreateView({
        'teamUrl': team.url,
        'key': 'create-' + team.slug
      })
    );
  },

  detail: function(teamSlug, discussionId) {
    log.info('DiscussionRouter:detail');
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    var discussion = store.find('discussions', discussionUrl);
    var back = urls.get('team:detail', {'slug': teamSlug});
    return dispatcher.render({
        'navLevel': 15,
        'title': discussion ? discussion.title : team.name,
        'back': back
      },
      DiscussionDetailView({
        'team': team,
        'discussion': discussion,
        'discussionUrl': discussionUrl,
        'key': 'discussion-detail' + discussionUrl
      })
    );
  }
});

module.exports = DiscussionRouter;
