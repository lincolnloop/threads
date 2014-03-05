'use strict';


var _ = require('underscore');
// TODO: backbone dependency is temporary until we find a better ajax lib
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

  // --------------------------
  // Internal utils methods
  // --------------------------
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
  this._set = function(type, response) {
    console.log('Syndicat:set');
    //console.log(type, response, responseType, xhr);
    // Adds or Updates an item of `type` in this._store.
    //
    // type: schema key/store (teams, users)
    // response: response to store in local cache
    // responseType: success/fail
    // xhr: XHR response object

    // initialize store for this type (if needed)
    // and store it under `store` for easy access.
    var store = this._store[type] ? this._store[type] : this._store[type] = {};
    var schema = this._schema[type];

    // check if response is an array, or just a simple object
    if (!Array.isArray(response)) {
      // isArray === false, try to parse response into an Array
      // schema.parse translates non-standard data into a list
      // format than can be stored.
      response = schema.parse ? schema.parse(response) : [response];
    }

    if (Object.prototype.toString.call(response) === '[object Object]') {
      store[response[this._schema.idAttribute]] = response;
      return;
    }
    response.forEach(function(item) {
      // handle oneToMany relations
      _.each(this._schema[type].oneToMany, function(relationType, attr) {
        var relationItems = item[attr];
        // check if item has an attr that is defined as a relation
        if (relationItems) {
          // check if attr value is an array,
          // if it's not empty, and if the content is an object and not a string
          if (Object.prototype.toString.call(relationItems) === '[object Array]' &&
            relationItems.length > 0 &&
            Object.prototype.toString.call(relationItems[0]) === '[object Object]') {
            // if relationItems is a list of objects,
            // populate the relation `table` with this data
            this._set(relationType, relationItems);
            // and replace the list of objects within `item`
            // by a list of `id's
            item[attr] = _.map(relationItems, function(relationItem) {
              return relationItem[this._schema.idAttribute];
            }.bind(this));
          }
        }
      }.bind(this));

      // TODO: compare objects and trigger change events
      store[item[this._schema.idAttribute]] = item;

    }.bind(this));
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
  this.findAll = function(type, query) {
    // find a list of items within the store. (THAT ARE NOT STORED IN BACKBONE COLLECTIONS)
    var store = this._store[type];
    if (!store || !Object.keys(store).length) {
      return [];
    }
    if (query === undefined) {
      // query is empty, no object is returned
      return store;
    } else if (Object.prototype.toString.call(query) === '[object Object]') {
      // if query is an object, assume it specifies filters.
      return _.filter(store, function(item) { return _.findWhere([item], query); });
    } else {
      throw new Error('Invalid query for findAll.');
    }
  };

  this.find = function(type, query) {
    // find a specific within the store. (THAT ARE NOT STORED IN BACKBONE COLLECTIONS)
    var store = this._store[type];
    if (!store || !Object.keys(store).length) {
      return undefined;
    }
    if (query === undefined) {
      // query is empty, no object is returned
      return  undefined;
    } else if (Object.prototype.toString.call(query) === '[object Object]') {
      // if query is an object, return the first match for the query
      return _.findWhere(store, query);
    } else if (Object.prototype.toString.call(query) === '[object String]') {
      // if query is a String, assume it stores the key/url value
      return store[query];
    }
  };
};

module.exports = Syndicat;
