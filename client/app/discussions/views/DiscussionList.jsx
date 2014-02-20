'use strict';

var React = require('react');
var Discussion = require('./Discussion');

var DiscussionList = React.createClass({
  render: function() {
    return (
      <ul className="discussion-list" ref="list">
        {this.props.discussions.map(Discussion)}
      </ul>
    );
  }
});

module.exports = DiscussionList;