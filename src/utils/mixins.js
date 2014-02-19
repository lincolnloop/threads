'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Events = {
  componentWillMount: function () {
    this.events = _.extend({}, Backbone.Events);
  },
  componentWillUnmount: function () {
    this.events.stopListening();
  }
};

exports.Events  = Events;
