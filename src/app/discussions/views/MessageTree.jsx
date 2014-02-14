"use strict";

var _ = require('underscore');
var React = require('react');
var MessageDetailView = require('./MessageDetail.jsx');

var MessageTreeView = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) &&
      _.isEqual(this.props.data, nextProps.data));
  },
  render: function () {
    console.log('MessageTreeView:render');
    var self = this;
    var childViews = this.props.data.children.map(function (message) {
      // recursively using JSX causes issues. Falling back to regular JS.
      return MessageTreeView({
        key: message.url,
        data: message,
        discussion: self.props.discussion
      });
    });
    return (
      <div className="message-children">
        <MessageDetailView key={this.props.data.url} data={this.props.data} discussion={this.props.discussion} />
        {childViews}
      </div>
    );
  }
});

module.exports = MessageTreeView;