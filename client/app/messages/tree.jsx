'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var log = require('loglevel');
var config = require('../utils/config');
var urls = require('../urls');
var store = require('../store');
var classSet = require('react/lib/cx');
var MessageDetailView = require('./detail');
var MessageReplyView = require('./reply');

var MessageTreeView = React.createClass({
  changeState: function (key, value) {
    // callback helper for `replying` state changes
    // usage:
    // _.partial(this.changeState, '<replying>', true|false)
    var state = {};
    state[key] = value;
    this.setState(state);
  },
  addReply: function () {
    // setup new message data
    var data = {
      'raw_body': this.refs.reply.refs.comment.getRawValue(),
      'parent': this.props.message.url,
      'read': true,
      'user': localStorage.getItem('user')
    };
    store.add('messages', data).then(function() {
      this.setState({'replying': false});
    }.bind(this));
    return false;
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
      'replying': false,
      'collapsed': false
    };
  },
  componentWillMount: function() {
    this.setState({'collapsed': this.props.message.collapsed});
  },
  render: function() {
    var replies = store.findAll('messages', {'parent': this.props.message.url});
    var classes = classSet({
      'message': true,
      'message-collapsed': this.state.collapsed
    });
    var repliesView = function(){};
    if (!this.props.message) {
      return (<span />);
    }
    if (replies && replies.length) {
      repliesView = React.DOM.div({className: "message-children"},
          _.map(replies, function(message) {
            var votes = _.map(this.props.message.votes, function(voteId) {
              // clone vote so we don't change the store object when doing vote.user = 'user';
              // TODO: The store should handle this.
              var vote = _.clone(store.find('votes', voteId));
              vote.user = store.find('users', vote.user);
              return vote;
            });
          // recursively using JSX causes issues. Falling back to regular JS.
          return MessageTreeView({
            'key': message.url,
            'message': message,
            'replies': message.children,
            'discussion': this.props.discussion
          });
        }.bind(this))
      );
    }
    // Get the ReplyView (or an empty render) based on `replying` state
    var ReplyView = this.state.replying ? MessageReplyView : function(){};
    return (
      React.DOM.div({'className': classes},
        MessageDetailView({
          'key': this.props.discussion.url,
          'message': this.props.message,
          'discussion': this.props.discussion,
          'handleReplyClick': _.partial(this.changeState, 'replying', true),
          'handleCollapse': this.handleCollapse
        }),
        ReplyView({
          'ref': 'reply',
          'handleReplySubmit': this.addReply,
          'handleReplyCancel': _.partial(this.changeState, 'replying', false)
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
