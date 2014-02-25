'use strict';

var _ = require('underscore');
var React = require('react');
var MessageActionsView = require('./MessageActions');
var VotesView = require('./VotesList');

var MessageContentView = React.createClass({

  render: function() {
    return (
      React.DOM.div(
        {'className': 'message-content'},
        React.DOM.div({
          'className': 'content',
          'dangerouslySetInnerHTML': {__html: this.props.message.body}
        }),
        !this.props.message.votes.length ? function() {} : VotesView({
            'votes': this.props.message.votes
          }),
        MessageActionsView({
          'handleReplyClick': this.props.handleReplyClick,
          'handleEditClick': this.props.handleEditClick,
          'message': this.props.message,
          'discussions': this.props.discussion
        })
      )
    );
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.message.body !== nextProps.message.body;
  }

});

module.exports = MessageContentView;
