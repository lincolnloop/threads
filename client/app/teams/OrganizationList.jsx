'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');
var OrganizationView = require('./Organization.jsx');
var teamUtils = require('./utils');

var OrganizationListView = React.createClass({
  getInitialState: function() {
    return {
      organizations: []
    }
  },
  getUpdatedTeams: function() {
    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);
    this.setState({
      'organizations': organizations
    });
  },
  componentWillMount: function() {
    this.getUpdatedTeams();
  },
  render: function() {
    log.info('OrganizationView:render');
    return (
      <div className="content-view">
        {this.state.organizations.map(function(org) {
          return OrganizationView(_.extend({'key': org.name}, org));
        })}
      </div>
    );
  },

  componentDidMount: function() {
    store.on('change:teams', this.getUpdatedTeams);
  },

  componentWillUnmount: function() {
    store.off('change:teams', this.getUpdatedTeams);
  }

});

module.exports = OrganizationListView;
