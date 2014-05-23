'use strict';

var React = require('react');
var loadingMixin = require('../mixins/loadingMixin');
var dispatcher = require('../dispatcher');
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
    store.get('discussions', {}, {'url': this.props.discussionUrl}).then(function() {
      var discussion = store.find('discussions', this.props.discussionUrl);
      this.setState({'loading': false});
      this.setState({
        'discussion': discussion
      });
      dispatcher.setProps({
        'title': discussion.title
      });
    }.bind(this));
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
    this.setState({
      'discussion': this.props.discussion
    });
  },

  render: function() {
    var message;
    var MessageTree;
    if (this.state.discussion) {
      message = store.find('messages', this.state.discussion.message);
      MessageTree = MessageTreeView({
        'key': message ? message.cid : 'empty-message',
        'message': message,
        'discussion': this.state.discussion
      });
    }
    return (
      <div className="discussion-detail content-view">
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
