"use strict";

var React = require('react');

var Discussion = React.createClass({
  render: function() {
    return (
        <li key={this.props.url}>
          <a href={this.props.message.permalink}>{this.props.title}</a>
        </li>
    );
  }
});

module.exports = Discussion;