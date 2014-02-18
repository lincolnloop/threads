'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

exports.events = {
  componentWillMount: function () {
    this.events = _.extend({}, Backbone.Events);
  },
  componentWillUnmount: function () {
    this.events.stopListening();
  }
};
