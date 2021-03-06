'use strict';
var _ = require('underscore');
var Backbone = require('backbone');
var classnames = require('classnames');
var clientconfig = require('clientconfig');
var log = require('loglevel');
var React = require('react');
var eventsMixin = require('../mixins/eventsMixin');
var app = require('../AppRouter');
var store = require('../store');
var urls = require('../urls');
var shortcuts = require('../utils/shortcuts');
var Attachment = require('./Attachment.jsx');
var MessageHeader = require('./MessageHeader.jsx');
var MessageContent = require('./MessageContent.jsx');
var MessageReplyForm = require('./MessageReplyForm.jsx');
var VotesListView = require('./VotesList.jsx');
var LayoutStore = require('../layout/LayoutStore');

var MessageView = React.createClass({
  mixins: [eventsMixin],

  handleReply: function(evt) {
    evt.preventDefault();
    var message = store.find('messages', this.props.message.url);
    var url = urls.get('message:reply', _.extend({'message_id': message.id}, shortcuts.getURIArgs()));
    // inline reply
    var mode = LayoutStore.getState().mode;
    // mobile answer
    if (mode === 'compact') {
      app.history.navigate(url, {'trigger': true});
    } else {
      log.debug('display message reply inline');
      //app.history.navigate(url, {'trigger': true});
      this.setState({
        'reply': true
      });
    }
  },

  handleReplySuccess: function() {
    // hide reply box
    this.setState({
      'reply': false
    });
  },

  handleFocusChange: function(info) {
    if (this.props.message.id === parseInt(info.id)) {
      this.setState({'focused': true});
    } else {
      this.setState({'focused': false});
    }
  },

  handleVote: function(evt) {
    var vote =  store.find('votes', {
      'message': this.props.message.url,
      'user': localStorage.getItem('user')
    });
    var voteValue = evt.currentTarget.dataset.vote;

    if (!vote) {
      // create a new vote
      vote = {
        'message': this.props.message.url,
        'value': voteValue
      }
      store.add('votes', vote).then(function() {
          return store.get('messages', null, {'url': this.props.message.url});
        }.bind(this)).done(function() {
          this.forceUpdate();
        }.bind(this));
    } else {
      if (vote.value === voteValue) {
        store.remove('votes', vote).then(function() {
          return store.get('messages', null, {'url': this.props.message.url});
        }.bind(this)).done(function() {
          this.forceUpdate();
        }.bind(this));
      } else {
        // update current vote
        store.update('votes', {
          'url': vote.url,
          'value': voteValue,
          'message': this.props.message.url
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
      'focused': false,
      'reply': false
    }
  },

  componentWillMount: function() {
    this.emitter.on('message:focus', this.handleFocusChange);
  },

  render: function() {
    // shortcuts
    var message = store.find('messages', this.props.message.url);
    var upVotes = store.findAll('votes', {'message': message.url, 'value': '+1'});
    var downVotes = store.findAll('votes', {'message': message.url, 'value': '-1'});
    var user = store.find('users', message.user);
    var attachments = message.attachments;
    // main message classes
    var classes = classnames({
      'message-container': true,
      'message-unread': !message.read,
      'message-focused': this.state.focused
    });
    var urlKeys = _.extend({'message_id': message.id}, shortcuts.getURIArgs());
    // TODO: This needs to query the store, not the message
    var hasUpVoted = _.find(upVotes, function(vote) {
      return vote.user === localStorage.getItem('user') && vote.value === '+1';
    });
    var hasDownVoted = _.find(downVotes, function(vote) {
      return vote.user === localStorage.getItem('user') && vote.value === '-1';
    });
    var canEdit = this.props.message.user === localStorage.getItem('user');
    var upVoteClasses = classnames({
      'vote': true,
      'voted': hasUpVoted
    });
    var downVoteClasses = classnames({
      'vote': true,
      'voted': hasDownVoted
    });
    var messageAttachmentClasses = classnames({
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
          <VotesListView upVotes={upVotes} downVotes={downVotes} />
          <div className="message-actions">
            <a className={upVoteClasses} onClick={this.handleVote} data-vote="+1">{hasUpVoted ? 'Liked' : 'Like'}</a>
            <a className={downVoteClasses} onClick={this.handleVote} data-vote="-1">{hasDownVoted ? 'Yanned' : 'Yann'}</a>
            <a className="reply" onClick={this.handleReply}>Reply</a>
            <a className="fork" href={urls.get('message:fork', urlKeys)}>fork</a>
            {false ? <a className="star" href="#">Star</a> : null}
            {canEdit ? <a className="edit" href={urls.get('message:edit', urlKeys)}>Edit</a> : null}
          </div>
        </div>
        {this.state.reply && (<MessageReplyForm
          messageId={message.id}
          parent_url={urls.get('api:messageChange', {'message_id': message.id})}
          callback={this.handleReplySuccess} />)}
      </div>
    );
  },

  componentWillUnmount: function() {
    this.emitter.off('message:focus', this.handleFocusChange);
  }
});

module.exports = MessageView;
