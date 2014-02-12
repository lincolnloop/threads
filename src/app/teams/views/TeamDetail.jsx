"use strict";

var _ = require('underscore'),
  Backbone = require('backbone'),
  React = require('react'),
  urls = require('../../urls'),
  EventsMixin = require('../../core/eventsMixin'),
  DiscussionList = require('../../discussions/views/DiscussionList.jsx');

var TeamDetail = React.createClass({
  updateStateFromLocal: function () {
    // get discussion data from our in-memory storage
    // and update the component state.
    var team = window.app.data.teams.get(this.props.team.url);
    // get in-memory discussion list
    this.setState({
      discussions: team.discussions.serialized()
    });
  },
  updateStateFromRemote: function () {
    // get discussion data the remote API
    // and update the component state.
    var team = window.app.data.teams.get(this.props.team.url);
    // fetch updated discussion list from the API
    team.discussions.fetch({
      success: function (collection, response) {
        this.setState({
          discussions: response.results
        });
      }.bind(this)
    });
  },
  getInitialState: function() {
    // we don't need teams stored in state
    // since they don't really change that much (for now)
    return {
      discussions: []
    }
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
  componentWillMount: function () {
    // Get in-memory discussions.
    // React recommends doing AJAX calls on componentDidMount,
    // so we keep these separate.
    this.updateStateFromLocal();
  },
  componentDidMount: function() {
    // make an ajax request to fetch discussions from the api
    this.updateStateFromRemote();
  },
  componentWillReceiveProps: function (nextProps) {
    // when changing teams, make sure we fetch
    // the new team discussions as well
    if (this.props.team.url !== nextProps.team.url) {
      this.updateStateFromLocal();
      this.updateStateFromRemote();
    }
  }
});

module.exports = TeamDetail;
