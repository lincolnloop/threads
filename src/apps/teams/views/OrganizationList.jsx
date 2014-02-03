"use strict";

var _ = require('underscore'),
  React = require('react'),
  EventsMixin = require('../../../core/eventsMixin'),
  Organization = require('./Organization.jsx');

var OrganizationList = React.createClass({
  mixins: [EventsMixin],
  componentWillMount: function () {
    console.log('OrganizationList:componentWillMount');
    _.bindAll(this, 'updateState');
    // TODO: add forces a render for every team that is added to a collection
    this.events.listenTo(this.props.teams, 'sync add remove change', this.updateState);
    this.updateState();
  },
  updateState: function () {
    console.log('OrganizationList:updateState');
    
    // Generate a serialized representation of organizations and teams
    // and set state for rendering
    this.setState({organizations: this.props.teams.serialized()});
  },
  render: function() {
    console.log('OrganizationList:render');
    return (
      <div className="team-list">
        {this.state.organizations.map(Organization)}
      </div>
    );
  }
});

module.exports = OrganizationList;
