'use strict';

var Backbone = require('backbone');
var dispatcher = require('../dispatcher');
var urls = require('../urls');
var MessageEditView = require('./MessageEdit.jsx');
var MessageReplyView = require('./MessageReply.jsx');

var MessageRouter = Backbone.Router.extend({

  getBackUrl: function() {
    return urls.get('discussion:detail:message',
          urls.resolve(window.location.pathname).kwargs);
  },

  routes: {
    ':teamSlug/:discussionId/:discussionSlug/:messageId/edit/': 'edit',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/reply/': 'reply'
  },

  edit: function(teamSlug, discussionId, discussionSlug, messageId) {
    return dispatcher.render({
        'navLevel': 20,
        'title': 'Edit message',
        'back': this.getBackUrl()
      },
      MessageEditView({
        'message_id': messageId,
        'navLevel': 20
      })
    );
  },

  reply: function(teamSlug, discussionId, discussionSlug, messageId) {
    return dispatcher.render({
        'navLevel': 20,
        'title': 'Reply to message',
        'back': this.getBackUrl()
      },
      MessageReplyView({
        'parent_url': urls.get('api:messageChange', {'message_id': messageId}),
        'navLevel': 20
      })
    );
  }
});

module.exports = MessageRouter;
