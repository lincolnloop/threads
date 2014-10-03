'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var classSet = require('react/lib/cx');
var clientconfig = require('clientconfig');
var log = require('loglevel');
var React = require('react');
var eventsMixin = require('../mixins/eventsMixin');
var store = require('../store');
var urls = require('../urls');
var Attachment = require('./Attachment.jsx');
var MessageHeader = require('./MessageHeader.jsx');
var MessageContent = require('./MessageContent.jsx');
var VotesListView = require('./VotesList.jsx');

var MessageView = React.createClass({
  mixins: [eventsMixin],

  handleFocusChange: function(info) {
    if (this.props.message.id === parseInt(info.id)) {
      this.setState({'focused': true});
    } else {
      this.setState({'focused': false});
    }
  },

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
      if (vote.value === '+1') {
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
      'expandAttachments': false,
      'focused': false
    }
  },

  componentWillMount: function() {
    this.emitter.on('message:focus', this.handleFocusChange);
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
      'message-unread': !message.read,
      'message-focused': this.state.focused
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
    var messageAttachmentClasses = classSet({
      'message-attachments': true,
      'expanded': !!this.state.expandAttachments,
      'has-attachments': !!attachments.length
    });
    return (
      <div className={classes}>
        <a name={'m' + message.id} className="anchor" />

        <MessageHeader date={message.date_created} 
                       messageId={message.id}
                       user={message.user} 
                       handleCollapse={this.props.handleCollapse} />
        <MessageContent body={message.body} />

        <div className="message-footer">
          <div className={messageAttachmentClasses}>
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
            <a className={voteClasses} onClick={this.handleVote}>{hasUpVoted ? 'liked' : 'like'}</a>
            <a className="reply" href={urls.get('message:reply', urlKeys)}>reply</a>
            <a className="fork" href="#">fork</a>
            {false ? <a className="star" href="#">star</a> : null}
            {canEdit ? <a className="edit" href={urls.get('message:edit', urlKeys)}>edit</a> : null}
          </div>
        </div>
      </div>
    );
  },

  componentWillUnmount: function() {
    this.emitter.off('message:focus', this.handleFocusChange);
  }
});

module.exports = MessageView;
