'use strict';

var React = require('react');
var eventsMixin = require('../mixins/eventsMixin');
var store = require('../store');
var urls = require('../urls');

var HeaderReloadTeams = React.createClass({
  mixins: [eventsMixin],

  handleReload: function() {
    this.emitter.emit('ajax', {'loading': true});
    store.fetch(function() {
      this.emitter.emit('ajax', {'loading': false});
    }.bind(this));
  },

  render: function () {
    return (
      <span className="actions">
        <a onClick={this.handleReload} className="reload">+</a>
      </span>
    );
  }
});

module.exports = HeaderReloadTeams;
