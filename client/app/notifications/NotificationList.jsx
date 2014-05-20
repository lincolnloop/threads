'use strict';

var _ = require('underscore');
var classSet = require('react/lib/cx');
var log = require('loglevel');
var moment = require('moment');
var React = require('react');
var store = require('../store');

var NotificationListView = React.createClass({

  render: function() {
    var notifications = store.findAll('notifications');
    log.info('notifications', notifications);
    return (
      <div className="notifications">
        <ul className="notifications-list">
          {_.map(notifications, function(notification) {
            var user = store.find('users', notification.from_user);
            var classes = classSet({
              'notification-item': true,
              'unread': !notification.is_read
            });
            return <li className={classes}>
              <h3>
                {user.name}&nbsp;
                {notification.verb}&nbsp;
                <a href={notification.link}>{notification.title}</a>&nbsp;
                <span className="date">{moment(notification.date_created).fromNow()}</span>
              </h3>
            </li>
          }.bind(this))}
        </ul>
      </div>
    );
  }

});

module.exports = NotificationListView;
