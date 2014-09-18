'use strict';

var Backbone = require('backbone');
var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');
var dispatcher = require('../dispatcher');
var DiscussionDetailView = require('./DiscussionDetail.jsx');
var DiscussionCreateView = require('./DiscussionCreate.jsx');
var TeamDetailView = require('../teams/TeamDetail.jsx');

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
    // views
    var discussionCreateView = DiscussionCreateView({
      'teamUrl': team.url,
      'key': 'create-' + team.slug
    });
    // layout setup
    return dispatcher.small({
      'navLevel': 10,
      'title': 'Create discussion',
      'back': back,
      'main': discussionCreateView,
    }).medium({
      'main': discussionCreateView
    }).large({
      'main': discussionCreateView
    }).render();
  },

  detail: function(teamSlug, discussionId) {
    log.info('DiscussionRouter:detail');
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    var discussion = store.find('discussions', discussionUrl);
    var back = urls.get('team:detail', {'slug': teamSlug});
    // views
    var viewOptions = {
      'team': team,
      'discussion': discussion,
      'discussionUrl': discussionUrl,
      'key': 'discussion-detail' + discussionUrl
    };
    return dispatcher.small({
      'navLevel': 15,
      'title': discussion ? discussion.title : team.name,
      'back': back,
      'main': DiscussionDetailView(viewOptions)
    }).medium({
      'main': DiscussionDetailView(viewOptions)
    }).large({
      'list': TeamDetailView({
        'team': team,
        'key': teamSlug
      }),
      'main': DiscussionDetailView(_.extend(viewOptions, {'loanimSelector': '.content-main'}))
    }).render();
  }
});

module.exports = DiscussionRouter;
