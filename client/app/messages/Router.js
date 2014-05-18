'use strict';

var Backbone = require('backbone');
var dispatcher = require('../dispatcher');
var store = require('../store');
var urls = require('../urls');
var MessageEditView = require('./MessageEdit.jsx');
var MessageReplyView = require('./MessageReply.jsx');

var MessageRouter = Backbone.Router.extend({

  routes: {
    ':teamSlug/:discussionId/:discussionSlug/:messageId/edit/': 'edit',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/reply/': 'reply'
  },

  edit: function(teamSlug, discussionId, discussionSlug, messageId) {
    return dispatcher.render(
      MessageEditView({
        'message_id': messageId,
        'navLevel': 20
      })
    );
  },

  reply: function(teamSlug, discussionId, discussionSlug, messageId) {
    var team = store.find('teams', {'slug': teamSlug});
    return dispatcher.render(
      MessageReplyView({
        'parent_url': urls.get('api:messageChange', {'message_id': messageId}),
        'navLevel': 20
      })
    );
  }
});

module.exports = MessageRouter;
