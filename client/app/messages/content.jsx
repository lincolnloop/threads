'use strict';

var _ = require('underscore');
var React = require('react');
var MessageActionsView = require('./actions');
var VotesListView = require('./votes-list');
var VotesView = require('./votes');
var urls = require('../urls');

var MessageContentView = React.createClass({

  render: function() {
    var message = this.props.message;
    // helper object to retrieve reply/edit urls
    var urlKeys = _.extend({'message_id': message.id}, urls.resolve(window.location.pathname).kwargs);
    // TODO: This needs to query the store, not the message
    var hasUpVoted = _.find(message.votes, function(vote) {
      return store.find('votes', {
        'url': vote,
        'user': localStorage.getItem('user'),
        'value': '+1'
      });
    });
    var canEdit = this.props.message.user ===  localStorage.getItem('user');

    return (
      React.DOM.div(
        {'className': 'message-content'},
        React.DOM.div({
          'className': 'content',
          'dangerouslySetInnerHTML': {__html: message.body}
        }),
        !this.props.votes.length ? function() {} : VotesListView({
            'votes': this.props.votes
          }),
        React.DOM.div(
          {'className': 'message-actions'},
          VotesView({
            'hasUpVoted': hasUpVoted,
            'handleVote': this.props.handleVote
          }),
          React.DOM.a({
            'href': urls.get('message:reply', urlKeys),
            'children': 'reply'
          }),
          canEdit ? React.DOM.a({
            'href': urls.get('message:edit', urlKeys),
            'children': 'edit'
          }) : ''
        )
      )
    );
  }

});

module.exports = MessageContentView;
