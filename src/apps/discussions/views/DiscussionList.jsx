"use strict";

var React = require('react'),
  Discussion = require('./Discussion.jsx');

var DiscussionList = React.createClass({
  render: function() {
    console.log('DiscussionList', this.props.discussions);
    return (
        <ul>
            {this.props.discussions.map(Discussion)}
        </ul>
    );
  }
});

module.exports = DiscussionList;