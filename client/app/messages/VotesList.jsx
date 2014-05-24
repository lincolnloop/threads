'use strict';

var _ = require('underscore');
var React = require('react');
var store = require('../store');

var VotesListView = React.createClass({
  render: function () {
    // votes should be objects that contain all the needed context
    return React.DOM.span({'className': 'votes-list'},
      _.map(this.props.votes, function(vote, counter, list) {
        var nodes = [];
        var user = store.find('users', vote.user);
        // add a comma separator between users (if appliable)
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
        // add `like this` words after last like
        if (counter === list.length - 1) {
          nodes.push(React.DOM.span({'children': ' like this'}));
        }
        return nodes;
      }.bind(this))
    );
  }
});

module.exports = VotesListView;
