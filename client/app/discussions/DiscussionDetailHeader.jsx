'use strict';

var React = require('react');
var urls = require('../urls');

var DiscussionDetailHeader = React.createClass({

  handleDeleteDiscussion: function(evt) {
    evt.preventDefault();
    alert('Are you really really really sure you want to do this?');
  },

  render: function() {
    var url = urls.get('api:discussionChange', {'discussion_id': this.props.discussionId});
    return (
      <span className="actions">
        <a href={url} className="delete" onClick={this.handleDeleteDiscussion}>delete this discussion</a>
      </span>
    );
  }
});

module.exports = DiscussionDetailHeader;
