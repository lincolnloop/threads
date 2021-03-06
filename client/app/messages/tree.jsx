'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var classnames = require('classnames');
var log = require('loglevel');
var config = require('../utils/config');
var urls = require('../urls');
var store = require('../store');
var MessageItem = require('./Message.jsx');
var ForkedMessage = require('./ForkedMessage.jsx');
var ForkedDiscussionLink = require('./ForkedDiscussionLink.jsx');

var MessageTreeView = React.createClass({

  isForked: function() {
    return !!this.props.message.discussion && !!this.props.message.parent;
  },

  isDiscussionMessage: function() {
    return this.props.discussion.message === this.props.message.url;
  },

  handleCollapse: function() {
    // toggle collapse
    var collapsed = this.state.collapsed ? false : true;
    // set state to refresh the UI
    this.setState({
      'collapsed': collapsed
    });
    // update the message with the new collapsed state
    Backbone.ajax({
      'type': 'PUT',
      'url': config.apiUrl + urls.get('api:message:collapseExpand', {
        'message_id': this.props.message.id
      })
    })
  },

  getInitialState: function() {
    return {
      'collapsed': false
    };
  },

  componentWillMount: function() {
    this.setState({'collapsed': this.props.message.collapsed});
  },

  render: function() {
    var replies = store.findAll('messages', {'parent': this.props.message.url});
    var classes = classnames({
      'message': true,
      'message-collapsed': this.state.collapsed
    });
    var repliesView = function(){};
    var MessageView = this.isForked() && !this.isDiscussionMessage() ? ForkedMessage : MessageItem;
    if (!this.props.message) {
      return (<span />);
    }
    if (replies && replies.length) {
      repliesView = React.createElement('div', {className: "message-children"},
          _.map(replies, function(message) {
            var votes = _.map(this.props.message.votes, function(voteId) {
              // clone vote so we don't change the store object when doing vote.user = 'user';
              // TODO: The store should handle this.
              var vote = _.clone(store.find('votes', voteId));
              vote.user = store.find('users', vote.user);
              return vote;
            });
          // recursively using JSX causes issues. Falling back to regular JS.
          return React.createElement(MessageTreeView, {
            'key': message.url,
            'message': message,
            'replies': message.children,
            'discussion': this.props.discussion
          });
        }.bind(this))
      );
    }
    return (
      React.DOM.div({'className': classes},
        this.isForked() && this.isDiscussionMessage() ? 
          <ForkedDiscussionLink parent={this.props.message.root} /> : null,
        React.createElement(MessageView, {
          'key': this.props.discussion.url,
          'message': this.props.message,
          'discussion': this.props.discussion,
          'handleCollapse': this.handleCollapse
        }),
        // TODO: Create a separate list view out of this
        repliesView
      )
    );
  }
  // maybe we don't need this
  // shouldComponentUpdate: function(nextProps, nextState) {

  //   // Only update component if:
  //   // 1. we're replying to it
  //   // 2. we stopped replying (which means it has a new children)
  //   // TODO: Realtime needs to be handled differently
  //   if (nextState.replying !== this.state.replying) {
  //     return true;
  //   }
  //   return false;
  // }
});

module.exports = MessageTreeView;
