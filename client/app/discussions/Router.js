'use strict';

var _ = require('underscore');
var Router = require('ampersand-router');
var React = require('react');
var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');
var dispatcher = require('../dispatcher');
var DiscussionDetailView = require('./DiscussionDetail.jsx');
var DiscussionCreateView = require('./DiscussionCreate.jsx');
var TeamDiscussions = require('./TeamDiscussions.jsx');
// headers
var HeaderCreateDiscussion = require('./HeaderCreateDiscussion.jsx');
var DiscussionDetailHeader = require('./DiscussionDetailHeader.jsx');

var DiscussionRouter = Router.extend({

  routes: {
    ':team/': 'list',
    'discussion/create/:teamSlug/': 'create',
    ':teamSlug/:discussionId/:discussionSlug/': 'detail',
    ':teamSlug/:discussionId/:discussionSlug/#:messageId': 'detail'
  },

  list: function(teamSlug) {
    log.info('discussion:detail');
    // fetch data
    var team = store.find('teams', {'slug': teamSlug});
    if (!team) {
      return;
    }
    // views
    var viewOptions = {
      'team': team,
      'key': teamSlug
    };
    var headerContextView = React.createElement(HeaderCreateDiscussion, {
      'team_slug': teamSlug
    });

    return dispatcher.small({
      'navLevel': 5,
      'title': team.name,
      'back': '/',
      'main': React.createElement(TeamDiscussions, viewOptions),
      'headerContextView': headerContextView
    }).medium({
      'team': team,
      'main': React.createElement(TeamDiscussions, _.extend(viewOptions, {'loanimSelector': '.content-main'})),
      'headerContextView': headerContextView
    }).large({
      'team': team,
      'list': React.createElement(TeamDiscussions, _.extend(viewOptions, {'loanimSelector': '.list-main'})),
      'headerContextView': headerContextView
    }).render();
  },

  create: function(teamSlug) {
    log.info('DiscussionRouter:detail');
    var team = store.find('teams', {'slug': teamSlug});
    var back = urls.get('team:detail', {'slug': teamSlug});
    // views
    var discussionCreateView = React.createElement(DiscussionCreateView, {
      'teamUrl': team.url,
      'key': 'create-' + team.slug
    });
    // views
    var viewOptions = {
      'team': team,
      'key': teamSlug
    };
    // layout setup
    return dispatcher.small({
      'navLevel': 10,
      'title': 'Create discussion',
      'back': back,
      'main': discussionCreateView,
    }).medium({
      'main': discussionCreateView
    }).large({
      'list': React.createElement(TeamDiscussions, _.extend(viewOptions, {'loanimSelector': '.list-main'})),
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
      'main': React.createElement(DiscussionDetailView, viewOptions)
    }).medium({
      'team': team,
      'main': React.createElement(DiscussionDetailView, viewOptions)
    }).large({
      'team': team,
      'discussion': discussion,
      'list': React.createElement(TeamDiscussions, {
        'team': team,
        'key': teamSlug,
        'discussionId': discussionId
      }),
      'main': React.createElement(DiscussionDetailView, _.extend(viewOptions, {
        'loanimSelector': '.content-main'
      })),
      'headerContextView': React.createElement(DiscussionDetailHeader)
    }).render();
  }
});

module.exports = DiscussionRouter;
