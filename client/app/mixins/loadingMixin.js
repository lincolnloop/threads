'use strict';

var log = require('loglevel');

var loadingMixin = {
  loadingContainer: null,

  componentDidMount: function() {
    log.info('loadingMixin:componentDidMount');
    if (this.state.loading !== true) {
      return;
    }
    var pageNode = this.getDOMNode();
    this.loadingContainer = document.createElement('div');
    this.loadingContainer.className = 'loanim';
    var loadingIcon= document.createElement('div');
    loadingIcon.className = 'loanim-icon';
    this.loadingContainer.appendChild(loadingIcon);
    pageNode.appendChild(this.loadingContainer);
    // start the animation
  },

  componentDidUpdate: function() {
    log.info('loadingMixin:componentDidUpdate');
    if (this.state.loading === true || !this.loadingContainer) {
      return;
    }

    var pageNode = this.getDOMNode();
    pageNode.removeChild(this.loadingContainer);
  },

  componentWillUnmount: function() {
    log.info('loadingMixin:componentWillUnmount');
    this.loadingContainer = null;
  }
};

module.exports = loadingMixin;