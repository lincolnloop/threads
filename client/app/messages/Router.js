'use strict';

var Router = require('ampersand-router');
var React = require('react');
var dispatcher = require('../dispatcher');
var urls = require('../urls');
var store = require('../store');
var MessageEditView = require('./MessageEdit.jsx');
var MessageReplyView = require('./MessageReply.jsx');
var MessageForkView = require('./MessageFork.jsx');
var TeamDetailView = require('../teams/TeamDetail.jsx');

var MessageRouter = Router.extend({

  getBackUrl: function() {
    return urls.get('discussion:detail:message',
      urls.resolve(window.location.pathname).kwargs);
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
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    var discussion = store.find('discussions', discussionUrl);
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
      'list': React.createElement(TeamDetailView, {
        'team': team,
        'key': teamSlug
      }),
      'main': mainView
    }).render();
  },

  reply: function(teamSlug, discussionId, discussionSlug, messageId) {
    var mainView = React.createElement(MessageReplyView, {
      'parent_url': urls.get('api:messageChange', {'message_id': messageId})
    });
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    var discussion = store.find('discussions', discussionUrl);
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
      'list': React.createElement(TeamDetailView, {
        'team': team,
        'key': teamSlug
      }),
      'main': mainView
    }).render();
  },

  fork: function(teamSlug, discussionId, discussionSlug, messageId) {
    var mainView = MessageForkView({
      'parent_url': urls.get('api:messageChange', {'message_id': messageId})
    });
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    var discussion = store.find('discussions', discussionUrl);
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
      'list': TeamDetailView({
        'team': team,
        'key': teamSlug
      }),
      'main': mainView
    }).render();
  }

});

module.exports = MessageRouter;
