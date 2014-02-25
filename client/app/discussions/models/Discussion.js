'use strict';

var Backbone = require('backbone');
var Message = require('./Message');
var MessageCollection = require('./MessageCollection');
var urls = require('../../urls');
var log = require('loglevel');

var DiscussionModel = Backbone.Model.extend({
  idAttribute: 'url',
  initialize: function () {
    log.debug('DiscussionModel:initialize');
    this.messages = new MessageCollection();
    this.setRelationships();
  },
  setRelationships: function () {
    /*
     * Set the backbone objects (message, latestMessage, messages)
     * from the JSON attributes on `this`.
     * This needs to be called manually when full data is fetched from the server.
     */
    
    var children = this.get('children');
    if (this.isNew()) {
      return this;
    }
    if (children) {
      this.messages.reset(children);
      this.messages.invoke('set', {team: this.get('team')}, {silent: true});
    }
    if (this.get('latest_message')) {
      this.set({
        date_latest_activity: this.get('latest_message').date_created
      });
    }

    return this;
  },
  url: function () {
    return this.id || urls.get('api:discussion');
  },
  getDateObj: function () {
    // TODO: this.get('date_latest_activity')
    // doesn't return on first save
    return new Date(this.get('message').date_latest_activity);
  },
  serialized: function () {
    var data = this.toJSON();
    if (data.message) {
      data.message.children = this.messages.serialized();
    }
    return data;
  }
});

module.exports = DiscussionModel;
