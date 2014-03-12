'use strict';

var _ = require('underscore');
var React = require('react');
var classSet = require('react/lib/cx');

var VotesView = React.createClass({

  render: function() {
    var classNames = classSet({
      'votes': true,
      'up-vote': this.props.hasUpVoted
    });
    var likeText = this.props.hasUpVoted ? 'liked' : 'like';
    return (
      <span className={classNames}>
        <a className="up-vote" onClick={_.partial(this.props.handleVote, '+1')}>{likeText}</a>
      </span>
    );
  }

});

module.exports = VotesView;
