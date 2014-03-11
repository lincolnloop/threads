'use strict';

var _ = require('underscore');
var React = require('react');
var classSet = require('react/lib/cx');

var VotesView = React.createClass({

  getInitialState: function() {
    return {vote: this.props.vote};
  },

  render: function() {
    var hasUpVote = this.state.vote === '+1';
    var classNames = classSet({
      'votes': true,
      'up-vote': hasUpVote
    });
    var likeText = hasUpVote ? 'liked' : 'like';
    return (
      <span className={classNames}>
        <a className="up-vote" onClick={_.partial(this.props.handleVote, '+1')}>{likeText}</a>
      </span>
    );
  }

});

module.exports = VotesView;
