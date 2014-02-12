"use strict";

var Backbone = require('backbone');
var User = require('./User');
var urls = require('../urls');

module.exports = Backbone.Collection.extend({
  model: User,
  url: function () {
    return urls.get('api:user');
  }
});