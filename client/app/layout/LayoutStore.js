'use strict';

var log = require('loglevel');
var app = require('../AppRouter');
var layoutActions = require('./actions');

class LayoutStore {
  constructor() {
    // nav status (open by default)
    this.showNav = true;
    // list of available mode options
    this.availableModes = ['compact', 'full'];
    // bind layout change actions
    this.bindActions(layoutActions);
    // check if a localStorage mode is enabled
    var localMode = localStorage.getItem('layoutMode');
    if (localMode && this.availableModes.indexOf(localMode) !== -1) {
      this.mode = localMode;
      return this;
    }

    // if no localStorage mode is defined
    // choose one as default
    if (window.innerWidth > 1200) {
      this.mode = 'full';
    } else {
      this.mode = 'compact';
    }
  }

  changeMode(mode) {
    // change mode in store and store selection in localStorage
    if (this.availableModes.indexOf(mode) !== -1) {
      this.mode = mode;
      localStorage.setItem('layoutMode', mode);
    }
  }

  openNav() {
    log.info('openNav');
    this.showNav = true;
  }

  closeNav() {
    log.info('closeNav');
    this.showNav = false;
  }
}

module.exports = app.alt.createStore(LayoutStore, 'LayoutStore');