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
      'icon': true,
      'user-notifications': true,
      'is-unread': this.props.unreadNotifications ? true : false
    });
    return (
      <footer id="bottom-nav">
        <a className="home icon">Home</a>
        <a href={urls.get('notifications')} className={notificationClasses}>
          <span className="notifications">{this.props.unreadNotifications}</span>
        </a>
        <a className="search icon">Search</a>
      </footer>
    );
  }
});

module.exports = Footer;
