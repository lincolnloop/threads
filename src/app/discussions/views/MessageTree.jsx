"use strict";

var _ = require('underscore');
var React = require('react');
var MessageDetailView = require('./MessageDetail');

var MessageTreeView = React.createClass({
  render: function () {
    var childViews = '';
    if (!this.props.message) {
      return (<span />);
    }
    if (this.props.message.children.length) {
      childViews = React.DOM.div({className: "message-children",
          children: this.props.message.children.map(function(message) {
          // recursively using JSX causes issues. Falling back to regular JS.
          return MessageTreeView({
            key: message.url,
            message: message,
            discussion: this.props.discussion
          });
        }.bind(this))
      });
    }
    return (
      <div className="message">
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
