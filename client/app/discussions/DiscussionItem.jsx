'use strict';

var log = require('loglevel');
var moment = require('moment');
var React = require('react');
var urls = require('../urls');
var store = require('../store');
var classnames = require('classnames');

var DiscussionItemView = React.createClass({
  render: function() {
    var team = store.find('teams', this.props.team);
    var latest = this.props.latest_message;
    var latestUser;
    // when we fetch from a discussion detail
    // we stop having latest_message for that discussion.
    if (latest) {
      latestUser = store.find('users', latest.user);
    }
    var url = urls.get('discussion:detail', {
      'team_slug': team.slug,
      'discussion_id': this.props.id,
      'slug': this.props.slug
    });
    var classes = classnames({
      'unread-item': true,
      'unread': this.props.unread_count !== 0 ? true : false
    });
    return (
        <li className="nav-item" data-slug={this.props.slug}>
          <a href={url}>
            <span className="item-content">
              <h3>{this.props.title}</h3>
              <span className={classes}>
                <span className="unread-count">{this.props.unread_count}</span>
              </span>
              {latest ? <span className="latest">
                {latest.url === this.props.message ? <span><span>Started by </span><span className="user-name">{latestUser.name} </span></span> : <span><span className="user-name">{latestUser.name}</span><span> replied </span></span>}
                <span className="timeago" dateTime={latest.date_created}>
                  {moment(latest.date_created).fromNow()}
                </span>
              </span> : null}
            </span>
          </a>
        </li>
    );
  }
});

module.exports = DiscussionItemView;
