'use strict';

var Q = require('q');
var fetch = require('./utils/fetch');
var Amygdala = require('amygdala');
var config = require('./utils/config');
var log = require('loglevel');
var getCookie = require('./utils/getCookie');

var store = new Amygdala({
    'config': {
      'apiUrl': config.apiUrl,
      'idAttribute': 'url',
      'headers': {
        'X-CSRFToken': getCookie('csrftoken')
      },
      'localStorage': false
    },
    'schema': {
      'teams': {
        'url': '/api/v2/team/',
        'orderBy': 'name'
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
          // data.results === true >> list
          // data.children === true >> detail
          if (data.children) {
            // add latest message to response since it's not returned by the detail API
            data.latest_message = data.children[data.children.length - 1] || data.message;
          }
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
        parse: function(data) {
          return data.results ? data.results : data;
        },
        'foreignKey': {
          'user': 'users',
          'discussion': 'discussions'
        }
      },
      'votes': {
        'url': '/api/v2/vote/'
      },
      'notifications': {
        'url': '/api/v2/notifications/',
        'orderBy': '-date_created',
        parse: function(data) {
          return data.results ? data.results : data;
        }
      }
    }
  }
);

store.fetch = function(successCallback, errorCallback) {
  log.info('store.fetch');
  // method to fetch initial data.
  // We handle this outside the store module itself and
  // on the store instance, because it's very app-specific.
  // Get common data using Q.all to manage multiple promises.

  Q.all([
    fetch.userUri(), this.get('teams'), this.get('users')
  ]).then(function(results) {
    log.info('store.fetch.then');
    // TODO: Move this somewhere else
    // We don't need to set/fetch this data if it already exists
    localStorage.setItem('user', results[0]);
    store.anonUser = {
      'email': 'nobody@gingerhq.com',
      'name': 'Deleted User'
    };
    successCallback();
  }, errorCallback).done();
};

// TODO: remove window.store once it is stable
module.exports = window.store = store;
