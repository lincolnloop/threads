'use strict';

var RSVP = require('rsvp');
var User = require('./auth/User');
var fetch = require('./utils/fetch');

var Store = function() {
  this._store = {};
};

Store.prototype = {
  fetch: function() {
    // Get common data using RSVP.hash() to manage multiple promises
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
        'name': 'Deleted User',
        'online': false,
        'typing': false
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

  getObject: function(key) {
    // TODO: `getObject` method, returns a Backbone object
    // we should not need this as a `public` method, 
    // but it will have to do for now.
    return this._store[key] ? this._store[key]: undefined;
  },

  get: function(key) {
    // External `get` method, returns a serialized Backbone object
    var item = this.getObject(key);
    return item ? item.serialized() : item;
  },

  findObject: function(key, kwargs) {
    // find a specific item within a collection
    var item = this.getObject(key);
    if (!(item && item.length)) {
      // no match, or not a collection
      return null;
    }
    // key match, and is a collection
    return item.findWhere(kwargs);

  },

  find: function(key, kwargs) {
    var item = this.findObject(key, kwargs);
    return item ? item.serialized() : item;
  }
};

module.exports = new Store();