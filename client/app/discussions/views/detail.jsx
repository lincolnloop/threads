'use strict';

var React = require('react');

var store = require('../../store');

// --------------------
// Models
// --------------------
var Discussion = require('../models/Discussion');

// --------------------
// Views
// --------------------
var MessageTreeView = require('../../messages/views/tree');


var DiscussionDetailView = React.createClass({

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
      success: function (model) {
        this.setState({
          'discussion': model.setRelationships().serialized()
        });
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      discussion: {}
    };
  },

  componentWillMount: function() {
    this.team = store.findObject('teams', {url: this.props.team.url});
    this.discussion = this.team.discussions.get(this.props.discussionUrl) ||
                      new Discussion({'url': this.props.discussionUrl});
    return {
      discussion: this.discussion.serialized()
    };
  },

  componentDidMount: function() {
    // fetch discussion data from remote
    this.fetchDiscussion();
  }

});

module.exports = DiscussionDetailView;
