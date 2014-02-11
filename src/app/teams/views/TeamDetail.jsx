"use strict";

var _ = require('underscore'),
  Backbone = require('backbone'),
  React = require('react'),
  urls = require('../../urls'),
  EventsMixin = require('../../core/eventsMixin'),
  DiscussionList = require('../../discussions/views/DiscussionList.jsx');

var TeamDetail = React.createClass({
  mixins: [EventsMixin],
 componentWillMount: function () {
    // listenTo team or discussion changes and trigger a state update
    // which will re-render the view
    this.events.listenTo(this.props.team, 'change', this.updateState);
    this.events.listenTo(this.props.team.discussions, 'sync add remove change', this.updateState);
    // state is cleaned up every time we render a component
    // so we need to update it on load always.
    this.updateState();
    // Always fetch discussions (we have no realtime yet).
    this.props.team.discussions.fetch();
  },
  updateState: function () {
    // props store a reference to the backbone model instance,
    // which in turns is a representation of the data that is in the DB.
    // state is what handles the data that is shown in the UI.
    this.setState({
      team: this.props.team.serialized(),
      discussions: this.props.team.discussions.serialized()
    });
  },
  render: function() {
    console.log('TeamDetailView:render');
    var team = this.state.team;
    var createDiscussionUrl;
    // get create discussion url
    // TODO: figure out a better, maybe one-liner, API
    createDiscussionUrl = '/' + urls.get('discussion:create:team', {
      team_slug: team.slug 
    });
    return (
      <div className="team-detail">
        <h2>{team.name}</h2>
        <a className="button" href={createDiscussionUrl}>New Discussion</a>
          {DiscussionList({discussions: this.state.discussions})}
      </div>
    );
  }
});

module.exports = TeamDetail;
