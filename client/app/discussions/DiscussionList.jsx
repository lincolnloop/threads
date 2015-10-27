'use strict';

var _ = require('underscore');
var React = require('react');
var DiscussionItem = require('./DiscussionItem.jsx');

var DiscussionListView = React.createClass({
  render: function() {
    return (
      React.DOM.ul({'className': 'discussion-list content-view', 'ref': 'list'},
        _.map(this.props.discussions, function(discussion) {
          return React.createElement(DiscussionItem, _.extend({'key': discussion.url}, discussion));
        })
      )
    );
  }
});

module.exports = DiscussionListView;
