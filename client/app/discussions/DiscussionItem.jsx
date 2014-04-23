'use strict';

var React = require('react');
var urls = require('../urls');
var store = require('../store');

var DiscussionItemView = React.createClass({
  render: function() {
    var team = store.find('teams', this.props.team);
    var url = urls.get('discussion:detail', {
      'team_slug': team.slug,
      'discussion_id': this.props.id,
      'slug': this.props.slug
    });
    return (
        <li className="nav-item">
          <a href={url}>
          <div className="item-unread">
            <span className="unread">11{this.props.unread_count}</span>
          </div>
            <div className="item-content">{this.props.title}</div>
          </a>
        </li>
    );
  }
});

module.exports = DiscussionItemView;
