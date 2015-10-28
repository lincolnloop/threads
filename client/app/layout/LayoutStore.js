'use strict';

var app = require('../AppRouter');
var layoutActions = require('./actions');

class LayoutStore {
  constructor() {
    // list of available mode options
    this.availableModes = ['compact', 'focused', 'full'];
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
    if (window.innerWidth < 800) {
      this.mode = 'compact';
    } else if (window.innerWidth > 1200 ) {
      this.mode = 'full';
    } else {
      this.mode = 'focused';
    }
  }

  changeMode(mode) {
    // change mode in store and store selection in localStorage
    if (this.availableModes.indexOf(mode) !== -1) {
      this.mode = mode;
      localStorage.setItem('layoutMode', mode);
    }
  }
}

module.exports = app.alt.createStore(LayoutStore, 'LayoutStore');