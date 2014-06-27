'use strict';

var React = require('react');
var urls = require('../urls');

var HeaderReloadTeams = React.createClass({

  handleReload: function() {
    debugger;
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
