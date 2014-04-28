'use strict';

var store = require('../store');
var urls = require('../urls');
var TopNav = require('../components/TopNav.jsx');
var MessageEditView = require('./MessageEdit.jsx');

var routes = {
  edit: function(teamSlug, discussionId, discussionSlug, messageId) {
    var team = store.find('teams', {'slug': teamSlug});
    // content > discussion detail view
    var contentView = MessageEditView({
      'message_id': messageId
    });
    var navView = TopNav({
      'title': team.name,
      'team': 'Reply to message',
      'backLink': urls.get('discussion:detail:message', urls.resolve(window.location.pathname).kwargs)
    });

    return {
      'content': contentView,
      'topNav': navView,
      'navLevel': 20
    };
  },

  reply: function() {
    return {
      'navLevel': 20
    };
  }
};

module.exports = routes;
