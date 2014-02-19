'use strict';

var Backbone = require('backbone');
var Vote = require('./Vote');

module.exports = Backbone.Collection.extend({
  model: Vote
});