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
    // generate permalink
    var kwargs = shortcuts.getURIArgs();
    kwargs.message_id = this.props.messageId;
    var permalink = urls.get('discussion:detail:message', kwargs);
    if (!user) {
      user = localStorage.getItem('anonUser');
    }

    var handleCollapse = false;
    //var handleCollapse = this.props.handleCollapse;
    return (
      <div className="message-header">
        <div className="user-thumbnail avatar">
          <a href={urls.get('user:detail', {'user_id': user.id})}>
            <img src={gravatar.get(user.email)} />
          </a>
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
