"use strict";

var React = require('react');
var MarkdownText = require('../../components/MarkdownText');

var MessageEditView = React.createClass({
  render: function () {
    return (
      <form className="message-content message-content-edit" onSubmit={this.props.handeEditSubmit}>
        <MarkdownText placeholder="Comment.."
                      ref="message"
                      defaultValue={this.props.message.raw_body}
                      required />
        <div className="message-actions message-edit-actions">
          <button type="submit">Update</button>
          <a onClick={this.props.handleEditCancelClick}>Cancel</a>
        </div>
      </form>
    );
  }
});

module.exports = MessageEditView;