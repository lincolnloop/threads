'use strict';

var React = require('react');
var urls = require('../urls');
var store = require('../store');
var classSet = require('react/lib/cx');

var DiscussionItemView = React.createClass({
  render: function() {
    var team = store.find('teams', this.props.team);
    var url = urls.get('discussion:detail', {
      'team_slug': team.slug,
      'discussion_id': this.props.id,
      'slug': this.props.slug
    });
    var classes = classSet({
      'unread-item': true,
      'unread': this.props.unread_count !== 0 ? true : false
    });
    return (
        <li className="nav-item">
          <a href={url}>
            <span className={classes}>
              <span className="unread-count">{this.props.unread_count}</span>
            </span>
            <div className="item-content">{this.props.title}</div>
          </a>
        </li>
    );
  }
});

module.exports = DiscussionItemView;
