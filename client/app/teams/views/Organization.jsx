'use strict';

var React = require('react');
var Team = require('./Team');
var log = require('loglevel');

var Organization = React.createClass({
  render: function() {
    log.debug('Organization:render');
    return (
      <div className="org-group" key={this.props.name}>
        <h3>{this.props.name}</h3>
        <ul>
            {this.props.teams.map(Team)}
        </ul>
      </div>
    );
  }
});

module.exports = Organization;
