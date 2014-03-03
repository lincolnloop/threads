'use strict';

var _ = require('underscore');
var React = require('react');
var Organization = require('./Organization');

var OrganizationList = React.createClass({
  render: function() {
    return (
      React.DOM.div(
        {'className': 'team-list'},
        this.props.organizations.map(function(org) {
          Organization(_.extend({key: org.name}, org))
        })
      )
    );
  }
});

module.exports = OrganizationList;
