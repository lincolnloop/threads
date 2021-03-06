'use strict';

var _ = require('underscore');
var $ = require('jquery');
var log = require('loglevel');
var React = require('react');
var eventsMixin = require('../mixins/eventsMixin');
var loadingMixin = require('../mixins/loadingMixin');
var dispatcher = require('../dispatcher');
var store = require('../store');
var urls = require('../urls');
var discussionActions = require('./discussionActions');

// --------------------
// Views
// --------------------
var HeaderUnread = require('./HeaderUnread.jsx');
var MessageTreeView = require('../messages/tree.jsx');

var DiscussionDetailView = React.createClass({
  mixins: [loadingMixin, eventsMixin],

  // --------------------
  // Custom methods
  // --------------------
  handleNewMessage: function() {
    this.forceUpdate();
  },

  navigateToHash: function() {
    var name = window.location.hash.replace('#', '');
    if (name.charAt(0) !== 'm') {
      name = 'm' + name;
    }
    var message = name ? $('a[name='+name+']') : null;
    // no hash, do nothing
    if (!name || !message.length) {
      return;
    }
    // else, scroll to message
    window.scrollTo(0, message.offset().top);

    this.emitter.emit('message:focus', {'id': name.replace('m', '')});
  },

  fetchDiscussion: function() {
    // Fetches discussion data from the remote API
    // and updates the component state.

    // show loading animation on the header
    this.emitter.emit('ajax', {'loading': true});

    store.get('discussions', {}, {'url': this.props.discussionUrl}).done(function() {
      // stop loading animation on the header
      this.emitter.emit('ajax', {'loading': false});

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

      // mark as read
      discussionActions.markAsRead(this.state.discussion);

      // trigger update header
      // we need to trigger the header update separately
      // because we can't pass the list of unread messages
      // before the discussion is fetched.
      // also, if we're fetching this page for the first time
      // we need to update the title.
      this.emitter.emit('header:update', {
        'title': discussion.title,
        'contextView': React.createElement(HeaderUnread, {
          'unreads': unreads
        })
      });
    }.bind(this));
  },

  // --------------------
  // React lifecycle
  // --------------------
  componentWillMount: function() {
    this.setState({
      'discussion': this.props.discussion
    });
    // TODO: Rework this, maybe enable this event in the store
    this.emitter.on('message:add', this.handleNewMessage);
  },

  getInitialState: function() {
    return {
      'discussion': {}
    };
  },

  render: function() {
    log.info('DiscussionDetail:render');
    var message;
    var MessageTree;
    if (this.state.discussion) {
      message = store.find('messages', this.state.discussion.message);
      MessageTree = React.createElement(MessageTreeView, {
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
    this.navigateToHash();
  },

  componentDidUpdate: function() {
    this.navigateToHash();
  },

  componentWillUnmount: function() {
    log.info('DiscussionDetailView:componentWillUnmount');
    window.onhashchange = null;
    // unbind message add handler
    this.emitter.off('message:add', this.handleNewMessage);
  }
});

module.exports = DiscussionDetailView;
