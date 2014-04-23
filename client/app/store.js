'use strict';

var RSVP = require('rsvp');
var fetch = require('./utils/fetch');
var Amygdala = require('amygdala');
var config = require('./utils/config');
var log = require('loglevel');

var store = new Amygdala({
  'apiUrl': config.apiUrl,
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

store.fetch = function(successCallback, errorCallback) {
  log.info('store.fetch');
  // method to fetch initial data.
  // We handle this outside the store module itself and
  // on the store instance, because it's very app-specific.
  // Get common data using RSVP.hash() to manage multiple promises.
  RSVP.hash({
    'userUri': fetch.userUri(),
    'teams': this.get('teams'),
    'users': this.get('users')
  }).then(function(results) {
    log.info('store.fetch.then');
    // TODO: Move this somewhere else
    // We don't need to set/fetch this data if it already exists
    localStorage.setItem('user', results.userUri);
    localStorage.setItem('anonUser', {
      'email': 'nobody@gingerhq.com',
      'name': 'Deleted User'
    });
    successCallback();
  }.bind(this)).catch(function(reason) {
    log.info('store.fetch.error');
    errorCallback(reason);
  }.bind(this));
};

// TODO: remove window.store once it is stable
module.exports = window.store = store;
