"use strict";

var _ = require('underscore');
var React = require('react');
var MessageDetailView = require('./MessageDetail.jsx');

var MessageTreeView = React.createClass({
  render: function () {
    if (!this.props.message) {
      return (<span />);
    }
    var childViews = this.props.message.children.map(function (message) {
      // recursively using JSX causes issues. Falling back to regular JS.
      return MessageTreeView({
        key: message.url,
        message: message,
        discussion: this.props.discussion
      });
    }.bind(this));
    return (
      <div className="message-children">
        {MessageDetailView({
          key: this.props.discussion.url,
          message: this.props.message,
          discussion: this.props.discussion
        })}
        {childViews}
      </div>
    );
  }
});

module.exports = MessageTreeView;