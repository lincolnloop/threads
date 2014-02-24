'use strict';

var Backbone = require('backbone');
var gravatar = require('../utils/gravatar');

var User = Backbone.Model.extend({
  idAttribute: 'url',
  // API URL
  url: function () {
    return this.id;
  },
  serialized: function () {
    var data = this.toJSON();
    data.gravatar = gravatar.get(this.get('email'));
    return data;
  }
});

module.exports = User;