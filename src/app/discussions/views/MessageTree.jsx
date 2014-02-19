"use strict";

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var urls = require('../../urls');
var MessageDetailView = require('./MessageDetail');
var MessageReplyView = require('./MessageReply');

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
      raw_body: this.refs.reply.refs.comment.getRawValue(),
      parent: this.props.message.url,
      read: true,
      user: window.app.data.requestUser.serialized()
    };
    Backbone.ajax({
      'url': urls.get('api:message'),
      'type': 'POST',
      'data': data,
      success: function(reply) {
        var replies = _.clone(this.state.replies);
        reply.user = window.app.data.users.get(reply.user).serialized();
        replies.push(reply);
        this.setState({'replies': replies, 'replying': false});
      }.bind(this)
    });
    // save a reply
    console.log('save reply');
    return false;
  },
  getInitialState: function() {
    var replies = [];
    if (this.props.message && this.props.message.children) {
      replies = this.props.message.children;
    }
    return {
      'replying': false,
      'replies': replies
    };
  },
  render: function() {
    var repliesView = function(){};
    // Get the ReplyView (or an empty render) based on `replying` state
    var ReplyView = this.state.replying ? MessageReplyView : function(){};
    if (!this.props.message) {
      return (<span />);
    }
    if (this.state.replies.length) {
      repliesView = React.DOM.div({className: "message-children",
          children: this.state.replies.map(function(message) {
          // recursively using JSX causes issues. Falling back to regular JS.
          return MessageTreeView({
            key: message.url,
            message: message,
            replies: message.children,
            discussion: this.props.discussion
          });
        }.bind(this))
      });
    }
    return (
      React.DOM.div({'className': 'message'},
        MessageDetailView({
          key: this.props.discussion.url,
          message: this.props.message,
          discussion: this.props.discussion,
          handleReplyClick: _.partial(this.changeState, 'replying', true)
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
});

module.exports = MessageTreeView;
