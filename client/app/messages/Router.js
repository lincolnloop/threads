'use strict';

var Router = require('ampersand-router');
var React = require('react');
var dispatcher = require('../dispatcher');
var urls = require('../urls');
var store = require('../store');
var MessageEditView = require('./MessageEdit.jsx');
var MessageReplyCompact = require('./MessageReplyCompact.jsx');
var MessageForkView = require('./MessageFork.jsx');
var TeamDiscussions = require('../discussions/TeamDiscussions.jsx');
var shortcuts = require('../utils/shortcuts');

var MessageRouter = Router.extend({

  getBackUrl: function() {
    return urls.get('discussion:detail:message', shortcuts.getURIArgs());
  },

  routes: {
    ':teamSlug/:discussionId/:discussionSlug/:messageId/edit/': 'edit',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/reply/': 'reply',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/fork/': 'fork'
  },

  edit: function(teamSlug, discussionId, discussionSlug, messageId) {
    var mainView = React.createElement(MessageEditView, {
      'message_id': messageId
    });
    var team = shortcuts.getActiveTeam();
    var discussion = shortcuts.getActiveDiscussion();
    return dispatcher.small({
      'navLevel': 20,
      'title': 'Edit message',
      'back': this.getBackUrl(),
      'main': mainView
    }).medium({
      'team': team,
      'main': mainView
    }).large({
      'team': team,
      'discussion': discussion,
      'list': React.createElement(TeamDiscussions, {
        'team': team,
        'key': teamSlug,
        'discussionId': discussionId
      }),
      'main': mainView
    }).render();
  },

  reply: function(teamSlug, discussionId, discussionSlug, messageId) {
    var team = shortcuts.getActiveTeam();
    var discussion = shortcuts.getActiveDiscussion();
    // main view/MessageReplyCompact
    var mainView = React.createElement(MessageReplyCompact, {
      'parent_url': urls.get('api:messageChange', {'message_id': messageId})
    });
    return dispatcher.small({
      'navLevel': 20,
      'title': 'Reply to message',
      'back': this.getBackUrl(),
      'main': mainView
    }).medium({
      'team': team,
      'main': mainView
    }).large({
      'team': team,
      'discussion': discussion,
      'list': React.createElement(TeamDiscussions, {
        'team': team,
        'key': teamSlug,
        'discussionId': discussionId
      }),
      'main': mainView
    }).render();
  },

  fork: function(teamSlug, discussionId, discussionSlug, messageId) {
    var mainView = React.createElement(MessageForkView, {
      'parent_url': urls.get('api:messageChange', {'message_id': messageId})
    });
    var team = shortcuts.getActiveTeam();
    var discussion = shortcuts.getActiveDiscussion();
    return dispatcher.small({
      'navLevel': 20,
      'title': 'Reply to message',
      'back': this.getBackUrl(),
      'main': mainView
    }).medium({
      'team': team,
      'main': mainView
    }).large({
      'team': team,
      'discussion': discussion,
      'list': React.createElement(TeamDiscussions, {
        'team': team,
        'key': teamSlug,
        'discussionId': discussionId
      }),
      'main': mainView
    }).render();
  }

});

module.exports = MessageRouter;
