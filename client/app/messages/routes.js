'use strict';

var log = require('loglevel');
var Q = require('q');
var store = require('../store');
var urls = require('../urls');
var TopNav = require('../components/TopNav.jsx');
var MessageEditView = require('./MessageEdit.jsx');
var MessageReplyView = require('./MessageReply.jsx');

var routes = {
  edit: function(teamSlug, discussionId, discussionSlug, messageId) {
    log.info('MessageEdit');
    var deferred = Q.defer();
    var team = store.find('teams', {'slug': teamSlug});
    // content > discussion detail view
    var contentView = MessageEditView({
      'message_id': messageId
    });
    var navView = TopNav({
      'title': team.name,
      'team': 'Edit message',
      'backLink': urls.get('discussion:detail:message', urls.resolve(window.location.pathname).kwargs)
    });

    deferred.resolve({
      'content': contentView,
      'topNav': navView,
      'navLevel': 20
    });

    return deferred.promise;
  },

  reply: function(teamSlug, discussionId, discussionSlug, messageId) {
    log.info('MessageReply');
    var deferred = Q.defer();
    var team = store.find('teams', {'slug': teamSlug});
    // content > discussion detail view
    var contentView = MessageReplyView({
      'parent_url': urls.get('api:messageChange', {'message_id': messageId})
    });
    var navView = TopNav({
      'title': team.name,
      'team': 'Reply to message',
      'backLink': urls.get('discussion:detail:message', urls.resolve(window.location.pathname).kwargs)
    });

    deferred.resolve({
      'content': contentView,
      'topNav': navView,
      'navLevel': 20
    });

    return deferred.promise;
  }
};

module.exports = routes;
