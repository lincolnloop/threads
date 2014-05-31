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
var Notification = require('./Notification.jsx');

var NotificationListView = React.createClass({

  render: function() {
    var notifications = store.findAll('notifications');
    log.info('notifications', notifications);
    return (
      <div className="notifications">
        <ul className="notifications-list content-view">
          {_.map(notifications, function(notification, key) {
            return <Notification key={'n-' + key}
                                 notification={notification} />
          })}
        </ul>
      </div>
    );
  },

  componentWillUnmount: function() {
    store._post(urls.get('api:notification')).done();
  }

});

module.exports = NotificationListView;
