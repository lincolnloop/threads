'use strict';

var _ = require('underscore');
var React = require('react');
var Header = require('../components/Header.jsx');
var OrganizationView = require('./Organization.jsx');

var OrganizationListView = React.createClass({
  render: function() {
    return (
      <div>
        <Header title="Threads" />
        <div className="team-list content">
          {this.props.organizations.map(function(org) {
            return OrganizationView(_.extend({key: org.name}, org));
          })}
        </div>
      </div>
    );
  }
});

module.exports = OrganizationListView;
