'use strict';

var Backbone = require('backbone');
var urls = require('../../urls');

var Message = Backbone.Model.extend({
  idAttribute: 'url',
  serialized: function() {
    var data = this.toJSON();
    // forked messages have both a discussion and a parent message
    data.isForked = this.get('discussion') && this.get('parent');
    return data;
  },
  validate: function (attrs) {
    var errors = [];
    if (!attrs.raw_body) {
      errors.push('Message cannot be empty');
    }
    return errors.length ? errors : null;
  },
  url: function () {
    return this.id || urls.get('api:message');
  }
});

module.exports = Message;
