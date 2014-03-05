'use strict';

var _ = require('underscore');
var React = require('react');
var Discussion = require('./item');

var DiscussionListView = React.createClass({
  render: function() {
    return (
      React.DOM.ul({'className': 'discussion-list', 'ref': 'list'},
        _.map(this.props.discussions, Discussion)
      )
    );
  }
});

module.exports = DiscussionListView;
