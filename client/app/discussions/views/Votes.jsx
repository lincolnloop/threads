'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');
var Vote = require('../models/Vote');
var store = require('../../store');

var VoteListView = React.createClass({
  render: function () {
    log.debug('VoteListView:render');
    var voteNodes = this.props.data.map(function (vote) {
      return (
        <li key={vote.url || 'new'}>
          {vote.user.name}
        </li>
      );
    });
    return (
      <ul>
        {voteNodes}
      </ul>
    );
  }
});

var VotesView = React.createClass({
  buildButtonText: function (votes, value) {
    var text = '',
      count = votes.length
    if (this.userVote.value === value) {
      text = 'You ';
      count -= 1;
      text += count > 0 ? '+' : '';
    }
    if (count > 0) {
      text += count + ' ';
    }
    text += value === '+1' ? String.fromCharCode(8593) : String.fromCharCode(8595);
    return text;
  },
  vote: function (value) {
    log.debug('VoteView:vote:' + value);
    if (!this.state.enabled) {
      log.debug('disabled');
      return;
    }
    this.enable(false);
    var message = this.props.discussion.getMessage(this.props.messageUrl),
      vote = new Vote(this.userVote),
      self = this,
      reEnable = function () {
        self.enable(true);
      };
    if (this.userVote.value === value) {
      message.votes.remove(vote);
      vote.destroy({success: reEnable});
    } else {
      vote.set('value', value);
      message.votes.add(vote, {merge: true});
      vote.save({}, {success: reEnable});
    }
  },
  enable: function (enabled) {
    this.setState({enabled: enabled});
  },
  getInitialState: function () {
    return {enabled: true};
  },
  render: function() {
    log.debug('VotesView:render');
    // get the users vote or create a placeholder for it
    this.userVote = _.find(this.props.data, function (vote) {
      return vote.user.url === store.get('user').id;
    }) || {
      user: store.get('user').id,
      message: this.props.messageUrl
    };
    var upvotes = _.where(this.props.data, {value: '+1'}),
      downvotes = _.where(this.props.data, {value: '-1'}),
      upvoteText = this.buildButtonText(upvotes, '+1'),
      downvoteText = this.buildButtonText(downvotes, '-1'),
      voteUp = _.partial(this.vote, '+1'),
      voteDown = _.partial(this.vote, '-1');


    return (
      <div className={this.state.disabled ? 'votes disabled' : 'votes'}>
      <button className="vote-button" onClick={voteUp}>{upvoteText}</button>
      <button className="vote-button" onClick={voteDown}>{downvoteText}</button>
      <VoteListView data={upvotes} value="+1" />
      <VoteListView data={downvotes} value="-1" />
      </div>
    );
  }
});
module.exports = VotesView;
