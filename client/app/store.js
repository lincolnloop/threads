'use strict';

var RSVP = require('rsvp');
var fetch = require('./utils/fetch');
var Syndicat = require('./Syndicat');

var store = new Syndicat({
  'apiUrl': 'http://localhost:8000',
  'idAttribute': 'url',
  'teams': {
    'url': '/api/v2/team/'
    // TODO: Add Team members and invitations as oneToMany relations
  },
  'users': {
    'url': '/api/v2/user/'
  },
  'discussions': {
    'url': '/api/v2/discussion/',
    'oneToMany': {
      'children': 'messages'
    },
    parse: function(data) {
      return data.results ? data.results : data;
    },
    'foreignKey': {
      'message': 'messages',
      'team': 'teams'
    }
  },
  'messages': {
    'url': '/api/v2/message/',
    'oneToMany': {
      'votes': 'votes'
    },
    'foreignKey': {
      'user': 'users',
      'discussion': 'discussions'
    }
  },
  'votes': {
    'url': 'api:vote'
  }
});

store.fetch = function() {
  // method to fetch initial data.
  // We handle this outside the store module itself and
  // on the store instance, because it's very app-specific.
  // Get common data using RSVP.hash() to manage multiple promises.
  RSVP.hash({
    'userUri': fetch.userUri(),
    'teams': fetch.teams(),
    'users': this.get('users')
  }).then(function(results) {
    // TODO: use setters and getters
    this._store.teams = results.teams;
    // TODO: Move this somewhere else
    // We don't need to set/fetch this data if it already exists
    localStorage.setItem('user', results.userUri);
    localStorage.setItem('anonUser', {
      'email': 'nobody@gingerhq.com',
      'name': 'Deleted User'
    });
    var evt = new CustomEvent('store:fetchSuccess');
    // TODO: trigger event from the object itself
    window.dispatchEvent(evt);
  }.bind(this)).catch(function(reason) {
    var evt = new CustomEvent('store:fetchFailed', reason);
    // TODO: trigger event from the object itself
    window.dispatchEvent(evt);
  }.bind(this));
};

module.exports = store;
