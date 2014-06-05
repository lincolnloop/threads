'use strict';

var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');

var discussionActions = {

  'markAsRead': function(discussion) {
    log.info('discussionActions:markAsRead');
    var team = store.find('teams', discussion.team);
    if (discussion.unread_count === 0) {
      return;
    }

    // Mark discussion as read in the server
    store._put(urls.get('api:lastread', discussion.id)).done(function() {
      // Decrease team unread count
      // TODO: Figure out a better way to do this
      if (team.unread > 0) {
        team.unread -= 1;
      }
      // Set discussion unread count to 0
      // TODO: Figure out a better way to do this
      discussion.unread_count = 0;
    }.bind(this));
  }

};

module.exports = discussionActions;
