"use strict";

var _ = require('underscore');
var React = require('react');
var VotesView = require('./votes');
var log = require('loglevel');
var store = require('../store');

var MessageActionsView = React.createClass({

  render: function() {
    var message = this.props.message;
    // TODO: This needs to query the store, not the message
    var hasUpVoted = _.find(message.votes, function(vote) {
      return store.find('votes', {
        'url': vote,
        'user': localStorage.getItem('user'),
        'value': '+1'
      });
    });
    return (
      React.DOM.div(
        {className: 'message-actions'},
        VotesView({
          'hasUpVoted': hasUpVoted,
          'handleVote': this.props.handleVote
        }),
        React.DOM.a({onClick: this.props.handleReplyClick, className: 'reply', children: 'reply'}),
        this.getEditView()
      )
    );
  },

  getEditView: function() {
    // Edit View
    var EditView = React.DOM.a({onClick: this.props.handleEditClick, children: 'edit'});
    // Show the Edit View only if the user is the comment author
    return this.props.message.user ===  localStorage.getItem('user') ? EditView : function(){}
  }

});

module.exports = MessageActionsView;
