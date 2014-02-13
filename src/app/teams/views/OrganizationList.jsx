"use strict";

var _ = require('underscore');
var React = require('react');
var EventsMixin = require('../../core/eventsMixin');
var Organization = require('./Organization.jsx');

var OrganizationList = React.createClass({
  mixins: [EventsMixin],
  componentWillMount: function () {
    _.bindAll(this, 'updateState');
    // TODO: add forces a render for every team that is added to a collection
    this.events.listenTo(this.props.teams, 'sync add remove change', this.updateState);
    this.updateState();
  },
  updateState: function () {
    // Generate a serialized representation of organizations and teams
    // and set state for rendering
    this.setState({organizations: this.props.teams.serialized()});
  },
  render: function() {
    return (
      <div className="team-list">
        {this.state.organizations.map(Organization)}
      </div>
    );
  }
});

module.exports = OrganizationList;
