"use strict";

var React = require('react');

var MessageEditActionsView = React.createClass({
  render: function() {
    return (
      React.DOM.div(
        {className: 'message-actions message-edit-actions'},
        React.DOM.button({onClick: this.props.handleUpdateClick, children: 'Update'})
      );
    )
  }
});

module.exports = MessageEditActionsView;
