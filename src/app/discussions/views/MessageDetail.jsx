"use strict";

var _ = require('underscore');
var React = require('react');
var VotesView = require('./Votes');
var MessageEditView = require('./MessageEdit');
var MessageContentView = require('./MessageContent');

require('react/addons');

var MessageDetail = React.createClass({
  getInitialState: function () {
    return {
      editing: false,
      replying: false
    };
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) &&
         this.props.message.url === nextProps.message.url &&
         this.props.message.body === nextProps.message.body &&
         _.isEqual(this.props.message.votes, nextProps.message.votes));
  },
  edit: function (event) {
    console.log('edit');
    this.setState({editing: true});
  },
  reply: function (event) {
    console.log('reply');
    this.setState({replying: true});
  },
  update: function() {
    // update message from current value
    console.log('update');
  },
  cancelEdit: function (input) {
    var state = {};
    state[input] = false;
    this.setState(state);
  },
  render: function () {
    console.log('MessageDetailView:render');
    var message = this.props.message;
    var user = message.user;
    // Get the correct MessageView based on editing state
    var MessageView = this.state.editing ? MessageEditView : MessageContentView;
    var doneEditing = _.partial(this.done, 'editing');
    var doneReplying = _.partial(this.done, 'replying');
    var classes = React.addons.classSet({
      'message-detail': true,
      'message-unread': !this.props.message.read,
      'message-collapsed': this.props.message.collapsed
    });
    return (
      React.DOM.div({className: classes},
        React.DOM.div({className: 'avatar'},
          React.DOM.img({src: user.gravatar})
        ),
        React.DOM.div({className: 'username', children: user.name}),
        React.DOM.div({className: 'date', children: message.date_created}),
        MessageView({
          message: message,
          discussion: this.props.discussion,
          handleEditClick: this.edit,
          handleReplyClick: this.reply,
          handleEditDoneClick: this.update,
          handleEditCancelClick: this.cancelEdit
        })
      )
    );
  }
});

module.exports = MessageDetail;
