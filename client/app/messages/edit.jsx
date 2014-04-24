'use strict';

var React = require('react');
var MarkdownView = require('../components/MarkdownTextarea');

var MessageEditView = React.createClass({
  render: function() {
    return (
      <form className="message-content" onSubmit={this.props.handleEditSubmit}>
        <MarkdownView placeholder="Comment.."
                      ref="comment"
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
