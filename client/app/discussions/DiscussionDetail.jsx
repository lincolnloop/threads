'use strict';

var React = require('react');
var loadingMixin = require('../mixins/loadingMixin');
var store = require('../store');
var urls = require('../urls');
var Header = require('../components/Header.jsx');

// --------------------
// Views
// --------------------
var MessageTreeView = require('../messages/tree');

var DiscussionDetailView = React.createClass({
  mixins: [loadingMixin],

  // --------------------
  // Custom methods
  // --------------------
  fetchDiscussion: function() {
    // Fetches discussion data from the remote API
    // and updates the component state.
    store.get('discussions', {}, {'url': this.props.discussion}).then(this.setDiscussion);
  },

  setDiscussion: function() {
    var discussion = store.find('discussions', this.props.discussion);
    if (!discussion) {
      discussion = {};
    }
    this.setState({
      'discussion': discussion,
      'loading': false
    })
  },

  // --------------------
  // React lifecycle
  // --------------------
  getInitialState: function() {
    return {
      'discussion': {},
      'loading': true
    };
  },

  componentWillMount: function() {
    this.setDiscussion();
  },

  render: function() {
    var message = store.find('messages', this.state.discussion.message);
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

  componentDidMount: function() {
    // fetch discussion data from remote
    this.fetchDiscussion();
  }

});

module.exports = DiscussionDetailView;
