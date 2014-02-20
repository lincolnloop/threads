'use strict';

var _ = require('underscore');
var React = require('react');
var Organization = require('./Organization');

var OrganizationList = React.createClass({
  render: function() {
    return (
      <div className="team-list">
        {this.props.organizations.map(Organization)}
      </div>
    );
  }
});

module.exports = OrganizationList;
