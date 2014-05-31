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

  getInitialState: function() {
    return {
      'notifications': []
    }
  },

  componentWillMount: function() {
    var notifications = store.findAll('notifications');
    this.setState({'notifications': notifications});
  },

  render: function() {
    return (
      <div className="notifications">
        <ul className="notifications-list content-view">
          {_.map(this.state.notifications, function(notification, key) {
            return <Notification key={'n-' + key}
                                 notification={notification} />
          })}
        </ul>
      </div>
    );
  },

  componentDidMount: function() {
    // TODO: loading indicator
    store.get('notifications').done(this.componentWillMount.bind(this));
  },

  componentWillUnmount: function() {
    store._post(urls.get('api:notification')).done();
  }

});

module.exports = NotificationListView;
