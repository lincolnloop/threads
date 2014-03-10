'use strict';

var React = require('react');
var MessageActionsView = require('./actions');
var VotesListView = require('./votes-list');

var MessageContentView = React.createClass({

  render: function() {
    return (
      React.DOM.div(
        {'className': 'message-content'},
        React.DOM.div({
          'className': 'content',
          'dangerouslySetInnerHTML': {__html: this.props.message.body}
        }),
        !this.props.votes.length ? function() {} : VotesListView({
            'votes': this.props.votes
          }),
        MessageActionsView({
          'handleReplyClick': this.props.handleReplyClick,
          'handleEditClick': this.props.handleEditClick,
          'handleVote': this.props.handleVote,
          'message': this.props.message
        })
      )
    );
  }

});

module.exports = MessageContentView;
