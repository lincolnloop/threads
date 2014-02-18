"use strict";

var _ = require('underscore'),
    Backbone = require('backbone');

module.exports = {
    componentWillMount: function () {
        this.events = _.extend({}, Backbone.Events);
    },
    componentWillUnmount: function () {
        this.events.stopListening();
    }
};