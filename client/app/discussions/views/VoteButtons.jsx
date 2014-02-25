'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');
var store = require('../../store');

var VotesView = React.createClass({
  getInitialState: function() {
    return {vote: this.props.vote};
  },
  render: function() {
    var hasUpVote = this.state.vote === '+1';
    var hasDownVote = this.state.vote === '-1';
    var classNames = React.addons.classSet({
      'votes': true,
      'up-vote': hasUpVote,
      'down-vote': hasDownVote
    });
    var likeText = hasUpVote ? 'liked' : 'like';
    var dislikeText = hasDownVote ? 'disliked' : 'dislike';
    return (
      <span className={classNames}>
        <a className="up-vote" onClick={_.partial(this.props.handleVote, '+1')}>{likeText}</a>
        <a className="down-vote" onClick={_.partial(this.props.handleVote, '-1')}>{dislikeText}</a>
      </span>
    );
  }
});
module.exports = VotesView;
