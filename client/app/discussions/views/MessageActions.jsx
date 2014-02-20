"use strict";

var React = require('react');
var VotesView = require('./Votes');
var log = require('loglevel');


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
    // Get the edit link if the user has edit permissions
    return this.props.canEdit ? React.DOM.a({onClick: this.props.handleEditClick, children: 'edit'}) : React.DOM.span({})
  }

});

module.exports = MessageActionsView;
