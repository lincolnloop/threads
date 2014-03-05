'use strict';

var React = require('react');
var urls = require('../../urls');

var DiscussionItemView = React.createClass({
  render: function() {
    var url = urls.get('discussion:detail', {
      'team_slug': '',
      'discussion_id': '',
      'slug': ''
    });
    return (
        <li key={this.props.url}>
          <a href={url}>
            {this.props.title}
            <span className="unread">{this.props.unread_count}</span>
          </a>
        </li>
    );
  }
});

module.exports = DiscussionItemView;
