'use strict';

var log = require('loglevel');
var moment = require('moment');
var React = require('react');
var store = require('../store');
var gravatar = require('../utils/gravatar');
var urls = require('../urls');
var shortcuts = require('../utils/shortcuts');

var MessageHeader = React.createClass({

  render: function() {
    var user = store.find('users', this.props.user);
    if (!this.props.permalink) {
      // if permalink is not set in props
      // generate permalink from current url
      var kwargs = shortcuts.getURIArgs();
      kwargs.message_id = this.props.messageId;
      var permalink = urls.get('discussion:detail:message', kwargs);
    }
    if (!user) {
      user = store.anonUser;
    }
    var handleCollapse = false;
    // TODO: add an icon for the deleted user
    return (
      <div className="message-header">
        <div className="user-thumbnail avatar">
          {user.id ? <a href={urls.get('user:detail', {'user_id': user.id})}>
            <img src={gravatar.get(user.email)} />
          </a> : <span>Deleted User</span>}
        </div>
        <div className="cite"></div>
        {handleCollapse ?
          <a className="collapse-button" onClick={this.props.handleCollapse}>Collapse</a>
        : null}
        <div className="username">
          <a href={urls.get('user:detail', {'user_id': user.id})}>
            {user.name}
          </a>
        </div>
        <div className="date">
          <a href={permalink} className="permalink">
            <time className="timeago" dateTime={this.props.date}>{moment.utc(this.props.date).local().fromNow()}</time>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = MessageHeader;
