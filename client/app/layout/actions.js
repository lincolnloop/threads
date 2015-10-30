'use strict';

var app = require('../AppRouter');

class LayoutActions {
  changeMode(mode) {
    this.dispatch(mode);
  }
  openNav() {
    this.dispatch();
  }
  closeNav() {
    this.dispatch();
  }
}

module.exports = app.alt.createActions(LayoutActions);