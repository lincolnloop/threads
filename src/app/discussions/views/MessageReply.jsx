"use strict";

var _ = require('underscore');
var React = require('react');

var MessageReplyView = React.createClass({
  render: function () {
    return (
      React.DOM.div(
        {className: 'message-content'},
        React.DOM.textarea({className: 'content'})
      )
    );
  }
});

module.exports = MessageReplyView;