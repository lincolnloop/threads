'use strict';

var Backbone = require('backbone');

var Vote = Backbone.Model.extend({
  idAttribute: 'url',
  serialized: function () {
    var data = this.toJSON();
    return data;
  },
  url: function () {
    return this.id || (this.get('message') + 'vote/');
  }
});

module.exports = Vote;