"use strict";

var React = require('react'),
  Discussion = require('./Discussion.jsx');

var DiscussionList = React.createClass({
  render: function() {
    return (
        <ul>
            {this.props.discussions.map(Discussion)}
        </ul>
    );
  }
});

module.exports = DiscussionList;