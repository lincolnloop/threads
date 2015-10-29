'use strict';
var urls = require('../urls');

var shortcuts = {
  getURIArgs: function() {
    return urls.resolve(window.location.pathname).kwargs
  },
  getActiveTeam: function() {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    if (kwargs.team_slug) {
      return store.find('teams', {'slug': kwargs.team_slug});
    } else {
      return null;
    }
  },
  getActiveDiscussion: function() {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    if (kwargs.discussion_id) {
      return store.find('discussions', {'id': parseInt(kwargs.discussion_id)});
    } else {
      return null;
    }
  },
  getActiveMessage: function() {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    if (kwargs.message_id) {
      return store.find('messages', {'id': parseInt(kwargs.message_id)});
    } else {
      return null;
    }
  }
}

module.exports = shortcuts;
