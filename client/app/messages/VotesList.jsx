'use strict';

var _ = require('underscore');
var React = require('react');
var store = require('../store');

var VotesListView = React.createClass({

  getVotes(votes, label) {
    return _.map(votes, function(vote, counter, list) {
      var nodes = [];
      var user = store.find('users', vote.user);
      // add a comma separator between users (if appliable)
      if (user) {
        if (counter !== 0 && counter !== list.length) {
          if (counter === list.length - 1) {
            // use `and` as separator for the last user
            nodes.push(React.DOM.span({'children': ' and '}));
          } else {
            nodes.push(React.DOM.span({'children': ', '}));
          }
        }
        nodes.push(React.DOM.a({
          'children': user.name
        }));
      }
      // add `like this` words after last like
      if (counter === list.length - 1) {
        if (list.length === 1){
          nodes.push(React.DOM.span({'children': ` ${label}s this`}));
        } else {
          nodes.push(React.DOM.span({'children': ` ${label} this`}));
        }
      }
      return nodes;
    }.bind(this))
  },

  render: function () {
    if (!this.props.upVotes && !this.props.downVotes) {
      return null;
    }
    // votes should be objects that contain all the needed context
    return React.DOM.span({'className': 'votes-list'},
      this.getVotes(this.props.upVotes, 'like'),
      this.getVotes(this.props.downVotes, 'Yann')
    );
  }
});

module.exports = VotesListView;
