'use strict';

var $ = require('jquery');
var _ = require('underscore');
var classnames = require('classnames');
var log = require('loglevel');
var moment = require('moment');
var React = require('react');
var urls = require('../urls');
var store = require('../store');
var gravatar = require('../utils/gravatar');

var NotificationView = React.createClass({

  render: function() {
    var notification = this.props.notification;
    var user = store.find('users', notification.from_user);
    var avatar = gravatar.get(user.email);
    var notificationType = notification.verb.substring(0, 7);

    var classList = {
      'notification-item': true,
      'unread': !notification.is_read
    }
    classList[notificationType] = true;

    return (
      <li className={classnames(classList)}>
      <a href={notification.link}><div className="avatar" ><img src={avatar} /></div>
      <div className="notification-content">
        <span className="username">{user.name} </span>
        <span className="user-action">{notification.verb} </span>
        <span className="notification-title">{notification.title} </span>
        <div className="notification-meta" >
          <span className="notification-type"></span>
          <span className="date">{moment.utc(notification.date_created).local().fromNow()}.</span>
        </div>
      </div></a>
    </li>
    );
  }

});

module.exports = NotificationView;
