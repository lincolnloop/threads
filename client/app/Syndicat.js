'use strict';

var _ = require('underscore');
var backbone = require('backbone');
var log = require('loglevel');

var Syndicat = function(schema) {
  // Session/browser key/value store with remote sync capabilities.
  // 
  //
  // API examples - reading data
  // this.store.findAll('teams'); // returns the teams list in JSON
  // this.store.find('teams', {'url': '/api/v2/team-xpto' }); // returns team xpto in JSON

  // --------------------------
  // Internal variables
  // --------------------------
  // schema
  this._schema = schema;
  // memory data storage
  this._store = {};
  // get absolute uri for api endpoint
  this._getURI = function(type) {
    if (!this._schema[type] || !this._schema[type].url) {
      throw new Error('Invalid type. Acceptable types are: ' + Object.keys(this._schema));
    }

    return this._schema.apiUrl + this._schema[type].url;
  },

  // ------------------------------
  // Internal data sync methods
  // ------------------------------
  this._set = function(type, response, responseType, xhr) {
    console.log(type, response, responseType, xhr);
    // Adds or Updates an item of `type` in this._store.
    //
    // type: schema key/store (teams, users)
    // response: response to store in local cache
    // responseType: success/fail
    // xhr: XHR response object

    // initialize store for this type (if needed)
    // and store it under `store` for easy access.
    var store = this._store[type] ? this._store[type] : this._store[type] = {};

    // check if response is an array, or just a simple object
    if (!Array.isArray(response)) {
      // isArray === false, set response as an array
      response = [response];
    }

    response.forEach(function(item) {
      // TODO: compare objects and trigger change events
      store[item[this._schema.idAttribute]] = item;
    }.bind(this));
    console.log(store);
  };

  this._remove = function(type, key, responseType, xhr) {
    console.log(type, key, responseType, xhr);
    // Removes an item of `type` from this._store.
    //
    // type: schema key/store (teams, users)
    // key: key to remove
    // responseType: success/fail
    // xhr: XHR response object

    // TODO
  };

  // ------------------------------
  // Public data sync methods
  // ------------------------------
  this.get = function(type, params, options) {
    // GET request for `type` with optional `params`
    //
    // type: schema key/store (teams, users)
    // params: extra queryString params (?team=xpto&user=xyz)
    // options: extra options
    // -  url: url override
    log.info('store:get', type, params);
    // request settings
    var settings = {
      'type': 'GET',
      'url': options && options.url ? options.url : this._getURI(type),
      'data': params
    };
    return backbone.ajax(settings).always(_.partial(this._set, type).bind(this));
  };

  this.add = function(type, object, options) {
    // POST/PUT request for `object` in `type`
    //
    // type: schema key/store (teams, users)
    // object: object to update local and remote
    // options: extra options
    // -  url: url override
    log.info('store:add', type, object);
    // request settings
    var settings = {
      'type': 'POST',
      'url': options && options.url ? options.url : this._getURI(type),
      'data': object
    };
    return backbone.ajax(settings).always(_.partial(this._set, type).bind(this));
  };

  this.update = function(type, object, options) {
    // POST/PUT request for `object` in `type`
    //
    // type: schema key/store (teams, users)
    // object: object to update local and remote
    // options: extra options
    // -  url: url override
    log.info('store:update', type, object, options);
    if (!object.url) {
      throw new Error('Missing object.url attribute. A url attribute is required for a PUT request.');
    }
    var settings = {
      'type': 'PUT',
      'url': object.url,
      'data': object
    };
    return backbone.ajax(settings).always(_.partial(this._set, type).bind(this));
  };

  this.remove = function(type, object, options) {
    // DELETE request for `object` in `type`
    log.info('store:delete', type, object, options);
    if (!object.url) {
      throw new Error('Missing object.url attribute. A url attribute is required for a DELETE request.');
    }
    var settings = {
      'type': 'DELETE',
      'url': object.url,
      'data': object
    };
    return backbone.ajax(settings).always(_.partial(this._remove, type).bind(this));
  };

  // ------------------------------
  // Public query methods
  // ------------------------------
  this.findAllObjects = function(type) {
    // TODO: `getObject` method, returns a Backbone object
    // we should not need this as a `public` method, 
    // but it will have to do for now.
    return this._store[type] ? this._store[type]: undefined;
  };

  this.findAll = function(type) {
    // External `get` method, returns a serialized Backbone object
    var item = this.findAllObjects(type);
    return item ? item.serialized() : item;
  };

  this.findObject = function(type, kwargs) {
    // find a specific item within a collection
    var item = this.findAllObjects(type);
    if (!(item && item.length)) {
      // no match, or not a collection
      return null;
    }
    // if there is a type match, and is a collection
    return item.findWhere(kwargs);

  };

  this.find = function(type, query) {
    // find items within the store. (THAT ARE NOT STORE IN BACKBONE COLLECTIONS)
    var store = this._store[type];
    if (!store || !Object.keys(store).length) {
      return undefined;
    }
    if (Object.prototype.toString.call(query) === '[object Object]') {
      // if query is an object, assume it specifies filters.
      // TODO
    } else if (Object.prototype.toString.call(query) === '[object String]') {
      // if query is a String, assume it stores the key/url value
      return store[query];
    }
  };
};

module.exports = Syndicat;
