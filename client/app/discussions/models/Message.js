'use strict';

var Backbone = require('backbone');
var urls = require('../../urls');

var Message = Backbone.Model.extend({
  idAttribute: 'url',
  serialized: function() {
    var data = this.toJSON();
    data.isForked = this.isForked();
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
  },
  isForked: function () {
    return this.get('discussion') && this.get('parent');
  }
});

module.exports = Message;
