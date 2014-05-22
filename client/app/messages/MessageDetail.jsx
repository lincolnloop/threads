'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var classSet = require('react/lib/cx');
var clientconfig = require('clientconfig');
var log = require('loglevel');
var moment = require('moment');
var React = require('react');
var gravatar = require('../utils/gravatar');
var store = require('../store');
var urls = require('../urls');
var VotesListView = require('./votes-list');
var VotesView = require('./votes');

var MessageDetailView = React.createClass({
  handleVote: function(value) {
    var message = store.find('messages', this.props.message.url);
    // find if user already has a vote
    var vote = _.find(message.votes, function(voteId) {
      // clone vote so we don't change the store object when doing vote.user = 'user';
      // TODO: The store should handle this.
      return store.find('votes', {
        'url': voteId,
        'user': localStorage.getItem('user')
      });
    }.bind(this));

    if (!vote) {
      // create a new vote
      vote = {
        'message': this.props.message.url,
        'value': '+1'
      }
      // TODO: Crossing should return a full url for some url groups
      var url = clientconfig.apiUrl + urls.get('api:vote', {'message_id': this.props.message.id});
      store.add('votes', vote, {'url': url}).then(function() {
          return store.get('messages', null, {'url': this.props.message.url});
        }.bind(this)).then(function() {
          this.forceUpdate();
        }.bind(this));
    } else {
      vote = store.find('votes', vote);
      if (vote.value === value) {
        store.remove('votes', vote).then(function() {
          return store.get('messages', null, {'url': this.props.message.url});
        }.bind(this)).then(function() {
          this.forceUpdate();
        }.bind(this));
      } else {
        // update current vote
        store.update('votes', {
          'url': vote.url,
          'value': value
        }).then(function() {
          this.forceUpdate();
        }.bind(this));
      }
    }
  },
  updateVotes: function() {
    var message = store.find('messages', this.props.message.url);
    var votes = _.map(message.votes, function(voteId) {
      // clone vote so we don't change the store object when doing vote.user = 'user';
      // TODO: The store should handle this.
      // TODO: Split upvotes and downvotes
      var vote = _.clone(store.find('votes', voteId));
      vote.user = store.find('users', vote.user);
      return vote;
    });
    this.setState({'votes': votes});
  },
  render: function() {
    // shortcuts
    var message = store.find('messages', this.props.message.url);
    var votes = _.map(message.votes, function(voteId) {
      // clone vote so we don't change the store object when doing vote.user = 'user';
      // TODO: The store should handle this.
      // TODO: Split upvotes and downvotes
      var vote = _.clone(store.find('votes', voteId));
      vote.user = store.find('users', vote.user);
      return vote;
    });
    // show only upvotes
    votes = _.filter(votes, function(vote) {
      return vote.value === '+1';
    });
    var attachments = message.attachments;
    var user = store.find('users', message.user);
    var div = React.DOM.div;
    // main message classes
    var classes = classSet({
      'message-detail': true,
      'message-unread': !message.read
    });
    var avatar = gravatar.get(user.email);
    var urlKeys = _.extend({'message_id': message.id}, urls.resolve(window.location.pathname).kwargs);
    // TODO: This needs to query the store, not the message
    var hasUpVoted = _.find(message.votes, function(vote) {
      return store.find('votes', {
        'url': vote,
        'user': localStorage.getItem('user'),
        'value': '+1'
      });
    });
    var canEdit = this.props.message.user === localStorage.getItem('user');
    return (
      <div className="message-container">
        <div className={classes}>
          <div className="avatar">
            <img src={avatar} />
          </div>
          <a className="collapse-button" onClick={this.props.handleCollapse}>Collapse</a>
          <div className="username">{user.name}</div>
          <div className="date">{moment(message.date_created).fromNow()}</div>
          <div className="message-content">
            <div dangerouslySetInnerHTML={{__html: message.body}} />
            {votes.length ? VotesListView({'votes': votes}) : null}
            <div className="message-actions">
              <VotesView hasUpVoted={hasUpVoted} handleVote={this.handleVote} />
              <a href={urls.get('message:reply', urlKeys)}>reply</a>
              {canEdit ? <a href={urls.get('message:edit', urlKeys)}>edit</a> : null}
              {attachments.length ? 
                <span className="attachments">
                  A: <a className="attachments-count">{attachments.length}</a>
                </span> 
              : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MessageDetailView;
