"use strict";

var React = require('react');
var MarkdownText = require('../../components/MarkdownText');

var MessageReplyView = React.createClass({
  render: function () {
    return (
      <form className="message-content message-content-reply" onSubmit={this.props.handleReplySubmit}>
        <MarkdownText placeholder="Comment.."
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