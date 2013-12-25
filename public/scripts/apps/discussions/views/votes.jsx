var _ = require('underscore'),
    React = require('react'),
    Vote = require('../models/vote');

var VoteListView = React.createClass({
    render: function () {
        console.log('VoteListView:render');
        var voteNodes = this.props.data.map(function (vote) {
            return (
                <li key={vote.url}>
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
    buildButtonText: function (votes, userVote, value) {
        var text = '',
            count = votes.length
        if (userVote === value) {
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
    upvote: function () {
        this.vote('+1');
    },
    downvote: function () {
        this.vote('-1');
    },
    vote: function (value) {
        var vote = new Vote({
                user: window.app.data.requestUser.url,
                value: value,
                message: this.props.messageUrl
            });
        vote.save();
        this.props.onUserInput('vote', vote);
    },
    render: function() {
        console.log('VotesView:render');
        var upvotes = _.where(this.props.data, {value: '+1'}),
            downvotes = _.where(this.props.data, {value: '-1'}),
            userVote = _.find(this.props.data, function (vote) {
                return vote.user.url === window.app.data.requestUser.url;
            }),
            upvoteText = this.buildButtonText(upvotes, userVote, '+1'),
            downvoteText = this.buildButtonText(downvotes, userVote, '-1');

        return (
          <div className="votes">
            <a className="vote-button" onClick={this.upvote}>{upvoteText}</a>
            <VoteListView data={upvotes} value="+1" />
            <a className="vote-button" onClick={this.downvote}>{downvoteText}</a>
            <VoteListView data={downvotes} value="-1" />
          </div>
        );
    }
});
module.exports = VotesView;
