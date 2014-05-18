'use strict';

var Backbone = require('backbone');
var log = require('loglevel');
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
    // content > discussion detail view
    var contentView = MessageEditView({
      'message_id': messageId
    });
    /*
    var navView = TopNav({
      'title': team.name,
      'team': 'Edit message',
      'backLink': urls.get('discussion:detail:message', urls.resolve(window.location.pathname).kwargs)
    });*/

    return dispatcher.render(
      MessageEditView({
        'message_id': messageId,
        'navLevel': 20
      })
    );
  },

  reply: function(teamSlug, discussionId, discussionSlug, messageId) {
    log.info('MessageReply');
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
