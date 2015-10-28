'use strict';

var app = require('../AppRouter');

class LayoutActions {
  changeMode(mode) {
    this.dispatch(mode);
  }
}

module.exports = app.alt.createActions(LayoutActions);