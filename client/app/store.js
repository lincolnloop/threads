'use strict';

var RSVP = require('rsvp');
var User = require('./auth/User');
var fetch = require('./utils/fetch');
var log = require('loglevel');

var Store = function() {
  // Session/memory data storage container class.
  // Provides a wrapper around global Backbone models and collections.
  // API examples:
  // this.store.get('user'); // returns the current user in JSON
  // this.store.get('teams'); // returns the teams list in JSON
  // this.store.find('teams', {'url': '/api/v2/team-xpto' }); // returns team xpto in JSON
  this._store = {};
  this._schema = {
    'votes': 'api:vote'
  };
};

Store.prototype = {
  fetch: function() {
    // Get common data using RSVP.hash() to manage multiple promises.
    // Note: this should be used at load only.
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
  },

  findAllObjects: function(type) {
    // TODO: `getObject` method, returns a Backbone object
    // we should not need this as a `public` method, 
    // but it will have to do for now.
    return this._store[type] ? this._store[type]: undefined;
  },

  findAll: function(type) {
    // External `get` method, returns a serialized Backbone object
    var item = this.findAllObjects(type);
    return item ? item.serialized() : item;
  },

  findObject: function(type, kwargs) {
    // find a specific item within a collection
    var item = this.findAllObjects(type);
    if (!(item && item.length)) {
      // no match, or not a collection
      return null;
    }
    // if there is a type match, and is a collection
    return item.findWhere(kwargs);

  },

  find: function(type, kwargs) {
    var item = this.findObject(type, kwargs);
    return item ? item.serialized() : item;
  }
};

Store.prototype.add = function(type, object) {
  // POST/PUT request for `object` in `type`
  log('store:add', type, object);
};

Store.prototype.update = function(type, object) {
  // POST/PUT request for `object` in `type`
  log('store:update', type, object);
};

Store.prototype.remove = function(type, object) {
  // DELETE request for `object` in `type`
  log('store:delete', type, object);
};

module.exports = new Store();