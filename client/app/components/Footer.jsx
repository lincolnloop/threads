'use strict';

var _ = require('underscore');
var classSet = require('react/lib/cx');
var React = require('react');
var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');

var Footer = React.createClass({
  render: function () {
    var user = store.find('users', localStorage.getItem('user'));
    var notificationClasses = classSet({
      'user-notifications': true,
      'is-unread': this.props.unreadNotifications ? true : false
    });
    return (
      <footer id="bottom-nav">
        <a href={urls.get('notifications')} className={notificationClasses}>
          {user.name} <span className="notifications">{this.props.unreadNotifications}</span>
        </a>
      </footer>
    );
  }
});

module.exports = Footer;
