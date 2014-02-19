"use strict";

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var urls = require('../../urls');
var VotesView = require('./Votes');
var MessageEditView = require('./MessageEdit');
var MessageContentView = require('./MessageContent');

require('react/addons');

var MessageDetail = React.createClass({
  changeState: function (key, value) {
    // callback helper for `editing` state changes
    // usage:
    // _.partial(this.changeState, '<editing>', true|false)
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
  getInitialState: function () {
    return {
      'editing': false,
      'message': this.props.message
    };
  },
  render: function () {
    console.log('MessageDetailView:render');
    // shortcuts
    var message = this.state.message;
    var user = message.user;
    var div = React.DOM.div;
    var img = React.DOM.img;
    // Get the correct MessageView based on `editing` state
    var MessageView = this.state.editing ? MessageEditView : MessageContentView;
    // main message classes
    var classes = React.addons.classSet({
      'message-detail': true,
      'message-unread': !message.read,
      'message-collapsed': message.collapsed
    });
    return (
      div({'className': 'message-container'},
        div({'className': classes},
          div({'className': 'avatar'},
            img({'src': user.gravatar})
          ),
          div({'className': 'username', 'children': user.name}),
          div({'className': 'date', 'children': message.date_created}),
          MessageView({
            'ref': 'message',
            'message': message,
            // TODO: we only need the discussion here because of votes
            // and that should not rely on the discussion at all
            'discussion': this.props.discussion,
            'canEdit': message.canEdit,
            'handleEditClick': _.partial(this.changeState, 'editing', true),
            // TODO: consider moving this outside of the message.
            // Replies are part of the MessageTree component, not the Message.
            'handleReplyClick': this.props.handleReplyClick,
            'handleEditSubmit': this.update,
            'handleEditCancelClick': _.partial(this.changeState, 'editing', false)
          })
        )
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
