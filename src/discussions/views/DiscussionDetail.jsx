'use strict';

var _ = require('underscore');
var React = require('react');
// --------------------
// Models
// --------------------
var Discussion = require('../models/Discussion');
// --------------------
// Views
// --------------------
var MessageTreeView = require('./MessageTree');

var DiscussionDetailView = React.createClass({
  fetchDiscussion: function() {
    // Fetches discussion detail from the remote API
    // and updates the component state.
    if (this.discussion.fetched) {
      // Do nothing if the discussion was already fetched
      // NOTE: This only works if we have realtime updates (!)
      return false;
    }
    this.discussion.fetch({
      reset: true,
      success: function (model, response) {
        this.setState({
          'discussion': model.setRelationships().serialized()
        });
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {
      discussion: {}
    }
  },
  componentWillMount: function() {
    this.team = window.data.teams.get(this.props.team.url);
    this.discussion = this.team.discussions.get(this.props.discussionUrl) ||
                      new Discussion({'url': this.props.discussionUrl});
    return {
      discussion: this.discussion.serialized()
    }
  },
  render: function() {
    var message = this.state.discussion.message;
    return (
      <div className="discussion-detail">
        <h2>{this.state.discussion.title}</h2>
        {MessageTreeView({
          'key': message ? message.cid : 'empty-message',
          'message': message,
          'discussion': this.state.discussion
        })}
      </div>
    );
  },
  componentDidMount: function() {
    // fetch discussion data from remote
    this.fetchDiscussion();
  }
});

module.exports = DiscussionDetailView;
