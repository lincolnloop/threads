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
var VotesListView = require('./VotesList.jsx');
var Attachment = require('./Attachment.jsx');

var MessageDetailView = React.createClass({

  handleVote: function(value) {
    var vote =  store.find('votes', {
        'message': this.props.message.url,
        'user': localStorage.getItem('user')
      });

    if (!vote) {
      // create a new vote
      vote = {
        'message': this.props.message.url,
        'value': '+1'
      }
      store.add('votes', vote).then(function() {
          return store.get('messages', null, {'url': this.props.message.url});
        }.bind(this)).done(function() {
          this.forceUpdate();
        }.bind(this));
    } else {
      vote = store.find('votes', vote);
      if (vote.value === value) {
        store.remove('votes', vote).then(function() {
          return store.get('messages', null, {'url': this.props.message.url});
        }.bind(this)).done(function() {
          this.forceUpdate();
        }.bind(this));
      } else {
        // update current vote
        store.update('votes', {
          'url': vote.url,
          'value': value
        }).done(function() {
          this.forceUpdate();
        }.bind(this));
      }
    }
  },

  toggleAttachments: function() {
    this.setState({
      'expandAttachments': !this.state.expandAttachments
    })
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

  getInitialState: function() {
    return {
      'expandAttachments': false
    }
  },

  render: function() {
    // shortcuts
    var message = store.find('messages', this.props.message.url);
    var votes = store.findAll('votes', {'message': message.url, 'value': '+1'});
    var user = store.find('users', message.user);
    var attachments = message.attachments;
    // main message classes
    var classes = classSet({
      'message-container': true,
      'message-unread': !message.read
    });
    var urlKeys = _.extend({'message_id': message.id}, urls.resolve(window.location.pathname).kwargs);
    // TODO: This needs to query the store, not the message
    var hasUpVoted = _.find(votes, function(vote) { 
      return vote.user === localStorage.getItem('user');
    });
    var canEdit = this.props.message.user === localStorage.getItem('user');
    var voteClasses = classSet({
      'up-vote': true,
      'up-voted': hasUpVoted
    });
    return (
      <div className={classes}>

        <div className="message-header">
          <a name={message.id} />
          <div className="avatar">
            <img src={gravatar.get(user.email)} />
          </div>
          <div className="cite"></div>
          <a className="collapse-button" onClick={this.props.handleCollapse}>Collapse</a>
          <div className="username">{user.name}</div>
          <div className="date">
            <a href="/lincoln-loop/12461/potential-project-united-nations-world-food-programme-wfp/#89624" 
               className="permalink">
              <time className="timeago" datetime={message.date_created}>{moment(message.date_created).fromNow()}</time>
            </a>
          </div>
        </div>

        <div className="message-content">
          <div dangerouslySetInnerHTML={{__html: message.body}} />
        </div>

        <div className="message-footer">
          <div className="message-attachments">
            {attachments.length ? 
              <a className="attachments-link" onClick={this.toggleAttachments}>
                <span className="attachments-count">{attachments.length}</span> Attachments: 
              </a> 
            : null}
            <div className="message-attachments-list">
              {this.state.expandAttachments ? 
                <ul className="attachment-list">
                  {_.map(attachments, function(attachment) {
                    return <Attachment attachment={attachment} />
                  })}
                </ul>
              : null}
            </div>
          </div>
          {votes.length ? VotesListView({'votes': votes}) : null}
          <div className="message-actions">
            <a className="up-vote" onClick={this.handleVote}>{hasUpVoted ? 'liked' : 'like'}</a>
            <a className="reply" href={urls.get('message:reply', urlKeys)}>reply</a>
            <a className="fork" href="#">fork</a>
            <a className="star" href="#">star</a>
            {canEdit ? <a className="edit" href={urls.get('message:edit', urlKeys)}>edit</a> : null}
          </div>


        </div>

      </div>
    );
  }
});

module.exports = MessageDetailView;
