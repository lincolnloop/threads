'use strict';

//var log = require('loglevel');
var ee = require('event-emitter');
var emitter = ee({});

var eventsMixin = {

  'emitter': emitter,

  componentWillUnmount: function() {
    // TODO: clear events binded by this component
  }
};

module.exports = eventsMixin;