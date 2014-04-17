"use strict";

var React = require('react');
var MarkdownView = require('../components/MarkdownTextarea');

var MessageReplyView = React.createClass({
  render: function () {
    return (
      <form className="message-content message-content-reply" onSubmit={this.props.handleReplySubmit}>
        <MarkdownView placeholder="Comment.."
                      ref="comment"
                      required />
        <div className="message-actions message-edit-actions">
          <button type="submit">Reply</button>
          <a onClick={this.props.handleReplyCancelClick}>Cancel</a>
        </div>
      </form>
    );
  }
});

module.exports = MessageReplyView;
