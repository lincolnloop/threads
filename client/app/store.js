'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var RSVP = require('rsvp');
var User = require('./auth/User');
var fetch = require('./utils/fetch');
var Syndicat = require('./Syndicat');
var log = require('loglevel');

var store = new Syndicat({
  'teams': {
    'url': 'api/v2/team/'
    // TODO: Add Team members and invitations as oneToMany relations
  },
  'users': {
    'url': 'api/v2/user/'
  },
  'discussions': {
    'url': '/api/v2/discussion/',
    'oneToMany': {
      'children': 'messages'
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

store.prototype.fetch = function() {
  // method to fetch initial data.
  // We handle this outside the store module itself and
  // on the store instance, because it's very app-specific.
  // Get common data using RSVP.hash() to manage multiple promises.
  RSVP.hash({
    'userUri': fetch.userUri(),
    'teams': fetch.teams(),
    'users': fetch.users()
  }).then(function(results) {
    // TODO: use setters and getters
    this._store.teams = results.teams;
    this._store.users = results.users;
    this._store.user = results.users.get(results.userUri);
    this._store.anonUser = new User({
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
