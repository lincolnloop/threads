'use strict';

var React = require('react');
var store = require('../../store');

var VotesListView = React.createClass({
  render: function () {
    return React.DOM.span({'className': 'votes-list'},
      this.props.votes.map(function(vote, counter, list) {
        var user = store.find('users', vote.user);
        var nodes = [];
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
      })
    );
  }
});

module.exports = VotesListView;
