'use strict';

var Backbone = require('backbone');
var Attachment = require('./Attachment');

module.exports = Backbone.Collection.extend({
  model: Attachment
});