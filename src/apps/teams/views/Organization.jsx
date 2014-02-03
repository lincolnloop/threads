"use strict";

var React = require('react'),
  Team = require('./Team.jsx');

var Organization = React.createClass({
  render: function() {
    console.log('Organization:render');
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
