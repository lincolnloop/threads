'use strict';

var _ = require('underscore');
var React = require('react');
var MessageActionsView = require('./MessageActions');
var VotesListView = require('./VotesList');

var MessageContentView = React.createClass({

  render: function() {
    return (
      React.DOM.div(
        {'className': 'message-content'},
        React.DOM.div({
          'className': 'content',
          'dangerouslySetInnerHTML': {__html: this.props.message.body}
        }),
        // TODO: Split upvotes and downvotes
        !this.props.message.votes.length ? function() {} : VotesListView({
            'votes': this.props.message.votes
          }),
        MessageActionsView({
          'handleReplyClick': this.props.handleReplyClick,
          'handleEditClick': this.props.handleEditClick,
          'handleVote': this.props.handleVote,
          'message': this.props.message
        })
      )
    );
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.message.body !== nextProps.message.body;
  }

});

module.exports = MessageContentView;
