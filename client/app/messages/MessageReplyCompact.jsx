'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var store = require('../store');
var MessageReplyForm = require('./MessageReplyForm.jsx');
// message components
var MessageHeader = require('./MessageHeader.jsx');
var MessageContent = require('./MessageContent.jsx');

// This is only used on the single pane/compact/mobile view
var MessageReplyCompact = React.createClass({
  getInitialState: function() {
    return {
      'expand': true
    }
  },

  componentWillMount: function () {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    var message = store.find('messages', {'id': parseInt(kwargs.message_id)});
    var author = message ? store.find('users', message.user) : null;

    this.setState({
      message: message,
      author: author
    });
  },

  render: function() {
    // TODO: Refactor Message, so we can replace the hard-coded data
    // TODO: Missing footer and attachments
    var message = this.state.message;
    return (
      <div className="message-reply content-view">
        {this.state.message ? <div className="message-container">
          <MessageHeader date={message.date_created}
                       messageId={message.id}
                       user={message.user}
                       handleCollapse={this.props.handleCollapse} />
          <MessageContent body={message.body} /> 
        </div> : null}

          <MessageReplyForm parent_url={this.props.parent_url} />
      </div>
    );
  }
});

module.exports = MessageReplyCompact;
