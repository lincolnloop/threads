'use strict';

var $ = require('jquery');
var _ = require('underscore');
var classSet = require('react/lib/cx');
var log = require('loglevel');
var moment = require('moment');
var React = require('react');
var urls = require('../urls');
var store = require('../store');
var gravatar = require('../utils/gravatar');

var NotificationListView = React.createClass({

  render: function() {
    var notifications = store.findAll('notifications');
    log.info('notifications', notifications);
    return (
      <div className="notifications">
        <ul className="notifications-list content-view">
          {_.map(notifications, function(notification, key) {
            var user = store.find('users', notification.from_user);
            var avatar = gravatar.get(user.email);
            var notificationType = notification.verb.substring(0, 7);

            var classList = {
              'notification-item': true,
              'unread': !notification.is_read
            }
            classList[notificationType] = true;

            return (<li className={classSet(classList)} key={'n-' + key}>
              <a href={notification.link}><div className="avatar" ><img src={avatar} /></div>
              <div className="notification-content">
                <span className="username">{user.name} </span>
                <span className="user-action">{notification.verb} </span>
                <span className="notification-title">{notification.title} </span>
                <div className="notification-meta" >
                  <span className="notification-type"></span>
                  <span className="date">{moment(notification.date_created).fromNow()}.</span>
                </div>
              </div></a>
            </li>)
          }.bind(this))}
        </ul>
      </div>
    );
  },

  componentWillUnmount: function() {
    store._post(urls.get('api:notification')).done();
  }

});

module.exports = NotificationListView;
