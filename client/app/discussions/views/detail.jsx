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
    console.log('DiscussionDetailView:render', message);
    var message = this.state.discussion.message;
    var MessageTree = function() {};
    if (message) {
      MessageTree = MessageTreeView({
        'key': message ? message.cid : 'empty-message',
        'message': message,
        'discussion': this.state.discussion
      });
    }
    return (
      <div className="discussion-detail">
        <h2>{this.state.discussion.title}</h2>
        {MessageTree}
      </div>
    );
  },

  setDiscussion: function() {
    console.log('setDiscussion');
    var discussion = store.find('discussions', this.props.discussion);
    if (!discussion) {
      discussion = {};
    }
    this.setState({
      'discussion': discussion
    })
  },

  fetchDiscussion: function() {
    // Fetches discussion data from the remote API
    // and updates the component state.
    store.get('discussions', {}, {'url': this.props.discussion}).then(this.setDiscussion);
  },

  getInitialState: function() {
    return {
      discussion: {}
    };
  },

  componentWillMount: function() {
    this.setDiscussion();
  },

  componentDidMount: function() {
    // fetch discussion data from remote
    this.fetchDiscussion();
  }

});

module.exports = DiscussionDetailView;
