'use strict';

var _ = require('underscore');
var Router = require('ampersand-router');
var React = require('react');
var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');
var dispatcher = require('../dispatcher');
var shortcuts = require('../utils/shortcuts');
var DiscussionDetailView = require('./DiscussionDetail.jsx');
var DiscussionCreateView = require('./DiscussionCreate.jsx');
var TeamDiscussions = require('./TeamDiscussions.jsx');
var DiscussionIntro = require('./DiscussionIntro.jsx');
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
    log.info('discussion:list');
    // fetch data
    var team = shortcuts.getActiveTeam();
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

    var discussionIntro = React.createElement(DiscussionIntro, {'team': team});

    return dispatcher.compact({
      'team': team,
      'main': React.createElement(TeamDiscussions, _.extend(viewOptions, {'loanimSelector': '.content-main'})),
      'headerContextView': headerContextView
    }).full({
      'team': team,
      'list': React.createElement(TeamDiscussions, _.extend(viewOptions, {'loanimSelector': '.list-main'})),
      'headerContextView': headerContextView,
      'discussionIntro': discussionIntro
    }).render();
  },

  create: function(teamSlug) {
    log.info('DiscussionRouter:detail');
    var team = shortcuts.getActiveTeam();
    var back = urls.get('team:detail', {'team_slug': team.slug});
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
    return dispatcher.compact({
      'main': discussionCreateView
    }).full({
      'list': React.createElement(TeamDiscussions, _.extend(viewOptions, {'loanimSelector': '.list-main'})),
      'main': discussionCreateView
    }).render();
  },

  detail: function(teamSlug, discussionId) {
    log.info('DiscussionRouter:detail');
    var team = shortcuts.getActiveTeam();
    var discussion = shortcuts.getActiveDiscussion();
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    var back = urls.get('team:detail', {'team_slug': team.slug});
    // views
    var mainView = React.createElement(DiscussionDetailView, {
      'team': team,
      'discussion': discussion,
      'discussionUrl': discussionUrl,
      'key': 'discussion-detail' + discussionUrl,
      'loanimSelector': '.content-main'
    });
    return dispatcher.compact({
      'back': back,
      'team': team,
      'main': mainView
    }).full({
      'team': team,
      'discussion': discussion,
      'list': React.createElement(TeamDiscussions, {
        'team': team,
        'key': teamSlug,
        'discussionId': discussionId
      }),
      'main': mainView,
      'headerContextView': React.createElement(DiscussionDetailHeader)
    }).render();
  }
});

module.exports = DiscussionRouter;
