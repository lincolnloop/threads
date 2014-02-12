"use strict";

var _ = require('underscore'),
  Backbone = require('backbone'),
  React = require('react'),
  urls = require('../../urls'),
  EventsMixin = require('../../core/eventsMixin'),
  DiscussionList = require('../../discussions/views/DiscussionList.jsx');

var TeamDetail = React.createClass({
  updateDiscussionsFromLocal: function(teamId) {
    // Gets discussion data from our in-memory storage
    // and updates the component state.
    var teamObj = window.app.data.teams.get(teamId);
    this.setState({
      discussions: teamObj.discussions.serialized()
    });
  },
  updateDiscussionsFromRemote: function(teamId) {
    // Gets discussion data from the remote API
    // and updates the component state.
    var teamObj = window.app.data.teams.get(teamId);
    teamObj.discussions.fetch({
      success: function (collection, response) {
        this.setState({
          discussions: response.results
        });
      }.bind(this)
    });
  },
  getInitialState: function() {
    // We don't need teams stored in state
    // since they don't really change that much (for now).
    return {
      discussions: []
    }
  },
  componentWillMount: function() {
    // Get in-memory discussions on first load.
    // React recommends doing AJAX calls on componentDidMount,
    // so we keep these separate.
    this.updateDiscussionsFromLocal(this.props.team.url);
  },
  render: function() {
    var team = this.props.team;
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
          <DiscussionList discussions={this.state.discussions} />
      </div>
    );
  },
  componentDidMount: function() {
    // Make an ajax request to fetch discussions from the api
    // this is only called on first load and after render
    this.updateDiscussionsFromRemote(this.props.team.url);
  },
  componentWillReceiveProps: function(nextProps) {
    // When changing teams, fetch discussions from local and remote.
    // NOTE: If we had realtime and our in-memory container already
    // had discussion, we could update from local only.
    // Since because we don't, we need to get it from both local and remote.
    if (this.props.team.url !== nextProps.team.url) {
      this.updateDiscussionsFromLocal(nextProps.team.url);
      this.updateDiscussionsFromRemote(nextProps.team.url);
    }
  }
});

module.exports = TeamDetail;
