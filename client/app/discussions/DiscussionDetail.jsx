'use strict';

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var loadingMixin = require('../mixins/loadingMixin');
var dispatcher = require('../dispatcher');
var store = require('../store');
var urls = require('../urls');

// --------------------
// Views
// --------------------
var HeaderUnread = require('./HeaderUnread.jsx');
var MessageTreeView = require('../messages/tree.jsx');

var DiscussionDetailView = React.createClass({
  mixins: [loadingMixin],

  // --------------------
  // Custom methods
  // --------------------
  fetchDiscussion: function() {
    // Fetches discussion data from the remote API
    // and updates the component state.
    store.get('discussions', {}, {'url': this.props.discussionUrl}).done(function() {
      // get the active discussion
      var discussion = store.find('discussions', this.props.discussionUrl);
      // get the discussion's message and list of replies for the discussion
      var message = store.find('messages', discussion.message);
      var unreads = store.findAll('messages', {'root': discussion.message, 'read': false});
      // check if the discussion's message is unread
      unreads = !message.read ? _.union([message], unreads) : unreads;
      // update state
      this.setState({
        'loading': false,
        'discussion': discussion
      });
      // update app
      // TODO: evaluate setting the headerContextView using events
      return dispatcher.setProps({
        'title': discussion.title,
        'headerContextView': HeaderUnread({
          'unreads': unreads
        })
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
    window.onhashchange = function() {
      log.info('hashchange', window.location.hash);
    }.bind(this);
  },

  componentWillUnmount: function() {
    log.info('DiscussionDetailView:componentWillUnmount');
    window.onhashchange = null;
  }

});

module.exports = DiscussionDetailView;
