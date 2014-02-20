'use strict';

var _ = require('underscore');
var React = require('react');
var MessageActionsView = require('./MessageActions');

var MessageContentView = React.createClass({

  render: function() {
    return (
      React.DOM.div(
        {'className': 'message-content'},
        React.DOM.div({
          'className': 'content',
          'dangerouslySetInnerHTML': {__html: this.props.message.body}
        }),
        MessageActionsView({
          'handleReplyClick': this.props.handleReplyClick,
          'handleEditClick': this.props.handleEditClick,
          'message': this.props.message,
          'discussions': this.props.discussion,
          'canEdit': this.props.canEdit
        })
      )
    );
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.message.body !== nextProps.message.body;
  }

});

module.exports = MessageContentView;
