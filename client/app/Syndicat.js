'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var User = require('./auth/User');
var log = require('loglevel');

var Syndicat = function(schema) {
  // Session/memory data storage container class.
  //
  // API examples:
  // this.store.findAll('teams'); // returns the teams list in JSON
  // this.store.find('teams', {'url': '/api/v2/team-xpto' }); // returns team xpto in JSON

  // --------------------------
  // Internal variables
  // --------------------------
  // schema
  this._schema = schema;
  // memory data storage
  this._store = {};

  // ------------------------------
  // Internal data sync methods
  // ------------------------------
  this._set = function(type, object, responseType, xhr) {
    // Adds or Updates an item of `type` in this._store.
    //
    // type: schema key/store (teams, users)
    // object: object to store in local cache
    // responseType: success/fail
    // xhr: XHR response object

    // TODO
  },

  this._remove = function(type, key, responseType, xhr) {
    // Removes an item of `type` from this._store.
    //
    // type: schema key/store (teams, users)
    // key: key to remove
    // responseType: success/fail
    // xhr: XHR response object

    // TODO
  },

  // ------------------------------
  // Public data sync methods
  // ------------------------------
  add: function(type, object, url) {
    // POST/PUT request for `object` in `type`
    // TODO: url is a work-around for cases where the API endpoint is dynamic
    log.info('store:add', type, object);
    if (!this._schema[type]) {
      throw new Error('Invalid type. Acceptable types are: ' + Object.keys(this._schema));
    }
    // request settings
    var settings = {
      'type': 'POST',
      'url': url ? url : this._schema[type],
      'data': object
    };
    return backbone.ajax(settings).always(_.partial(this._set, type).bind(this));
  },

  update: function(type, object) {
    // POST/PUT request for `object` in `type`
    log.info('store:update', type, object);
    if (!object.url) {
      throw new Error('Missing object.url attribute. A url attribute is required for a PUT request.');
    }
    var settings = {
      'type': 'PUT',
      'url': object.url,
      'data': object
    };
    return backbone.ajax(settings).always(_.partial(this._set, type).bind(this));
  },

  remove: function(type, object) {
    // DELETE request for `object` in `type`
    log.info('store:delete', type, object);
    if (!object.url) {
      throw new Error('Missing object.url attribute. A url attribute is required for a DELETE request.');
    }
    var settings = {
      'type': 'DELETE',
      'url': object.url,
      'data': object
    };
    return backbone.ajax(settings).always(_.partial(this._remove, type).bind(this));
  },

  // ------------------------------
  // Public query methods
  // ------------------------------
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

module.exports = Syndicat;
