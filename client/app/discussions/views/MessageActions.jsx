"use strict";

var React = require('react');
var VotesView = require('./Votes');
var log = require('loglevel');
var store = require('../../store');

var MessageActionsView = React.createClass({

  render: function() {
    log.debug('MessageActionsView:render');
    var message = this.props.message;
    return (
      React.DOM.div(
        {className: 'message-actions'},
        VotesView({
          'data': message.votes,
          'messageUrl': message.url,
          'discussion': this.props.discussion
        }),
        React.DOM.a({onClick: this.props.handleReplyClick, children: 'reply'}),
        this.getEditView()
      )
    );
  },

  getEditView: function() {
    // Edit View
    var EditView = React.DOM.a({onClick: this.props.handleEditClick, children: 'edit'});
    // Show the Edit View only if the user is the comment author
    return this.props.message.user ===  store.get('user').url ? EditView : function(){}
  }

});

module.exports = MessageActionsView;
