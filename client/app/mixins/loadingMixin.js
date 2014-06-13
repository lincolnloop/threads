'use strict';

var $ = require('jquery');
var log = require('loglevel');

var loadingMixin = {
  $loanim: null,

  getInitialState: function() {
    return {
      'loadingClass': this.loadingClass ? this.loadingClass : 'loanim',
      'loading': true
    };
  },

  componentDidMount: function() {
    log.info('loadingMixin:componentDidMount');
    if (this.state.loading !== true) {
      return;
    }
    this.$loanim = $('<div class="'+this.state.loadingClass+'"><div class="'+this.state.loadingClass+'-icon" /></div>');
    $('#main').append(this.$loanim);
    // start the animation
  },

  componentDidUpdate: function() {
    log.info('loadingMixin:componentDidUpdate');
    if (this.state.loading === true || !this.$loanim) {
      return;
    }
    
    this.$loanim.remove();
  },

  componentWillUnmount: function() {
    if (this.$loanim) {
      this.$loanim.remove();
    }
  }
};

module.exports = loadingMixin;