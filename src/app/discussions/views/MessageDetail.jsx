"use strict";

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var VotesView = require('./Votes');
var MessageEditView = require('./MessageEdit');
var MessageContentView = require('./MessageContent');
var MessageReplyView = require('./MessageReply');

require('react/addons');

var MessageDetail = React.createClass({
  changeState: function (key, value) {
    // callback helper for edit/reply/cancel state changes
    // usage:
    // _.partial(this.changeState, '<editing|replying>', true|false)
    var state = {};
    state[key] = value;
    this.setState(state);
  },
  update: function() {
    // update message from current value
    var rawValue = this.refs.message.refs.comment.getRawValue();
    var data = _.extend(_.clone(this.state.message), {raw_body: rawValue});
    // TODO: replace with an AJAX mixin
    Backbone.ajax({
      'url': this.state.message.url,
      'type': 'PUT',
      'data': data,
      success: function(message) {
        var updatedMessage = _.extend(_.clone(this.state.message), message);
        updatedMessage.user = window.app.data.users.get(message.user).serialized();
        this.setState({'message': updatedMessage, 'editing': false});
      }.bind(this)
    });
    return false;
  },
  reply: function () {
    // save a reply
    console.log('save reply');
  },
  getInitialState: function () {
    return {
      'editing': false,
      'replying': false,
      'message': this.props.message
    };
  },
  render: function () {
    console.log('MessageDetailView:render');
    // shortcuts
    var message = this.state.message;
    var user = message.user;
    // Get the correct MessageView based on `editing` state
    var MessageView = this.state.editing ? MessageEditView : MessageContentView;
    // Get the ReplyView (or an empty render) based on `replying` state
    var ReplyView = this.state.replying ? MessageReplyView: function(){};
    // main message classes
    var classes = React.addons.classSet({
      'message-detail': true,
      'message-unread': !message.read,
      'message-collapsed': message.collapsed
    });
    return (
      React.DOM.div({'className': 'message-container'},
        React.DOM.div({'className': classes},
          React.DOM.div({'className': 'avatar'},
            React.DOM.img({'src': user.gravatar})
          ),
          React.DOM.div({'className': 'username', 'children': user.name}),
          React.DOM.div({'className': 'date', 'children': message.date_created}),
          MessageView({
            'ref': 'message',
            'message': message,
            'discussion': this.props.discussion,
            'canEdit': message.canEdit,
            'handleEditClick': _.partial(this.changeState, 'editing', true),
            'handleReplyClick': _.partial(this.changeState, 'replying', true),
            'handleEditSubmit': this.update,
            'handleEditCancelClick': _.partial(this.changeState, 'editing', false)
          })
        ),
        ReplyView({
          'handleReplySubmit': this.reply,
          'handleCancelClick': _.partial(this.changeState, 'replying', false)
        })
      )
    );
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) &&
         this.state.message.url === nextProps.message.url &&
         this.state.message.body === nextProps.message.body &&
         _.isEqual(this.state.message.votes, nextProps.message.votes));
  }
});

module.exports = MessageDetail;
