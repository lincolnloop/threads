'use strict';

var _ = require('underscore');
var React = require('react');
var OrganizationView = require('./Organization.jsx');

var OrganizationListView = React.createClass({
  render: function() {
    return (
      React.DOM.div(
        {'className': 'team-list content-view'},
        this.props.organizations.map(function(org) {
          return OrganizationView(_.extend({key: org.name}, org));
        })
      )
    );
  }
});

module.exports = OrganizationListView;
