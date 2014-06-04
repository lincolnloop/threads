'use strict';

var _ = require('underscore');
var classSet = require('react/lib/cx');
var React = require('react');
var log = require('loglevel');
var store = require('../store');
var urls = require('../urls');

var Footer = React.createClass({

  getNotifications: function() {
    store.get('notifications').done(function() {
      var count = store.findAll('notifications', {'is_read': false}).length;
      this.setState({
        'unreadNotifications': count
      })
    }.bind(this));
  },

  getInitialState: function() {
    log.info('AppView:getInitialState');
    return {
      'unreadNotifications': 0
    }
  },

  render: function () {
    var user = store.find('users', localStorage.getItem('user'));
    var notificationClasses = classSet({
      'icon': true,
      'user-notifications': true,
      'is-unread': this.state.unreadNotifications ? true : false
    });
    return (
      <footer id="bottom-nav">
        <ul>
          <li><a href="/" className="home icon">Home</a></li>
          <li><a className="settings icon">Settings</a></li>
          <li><a href={urls.get('notifications')} className={notificationClasses}>
            <span className="notifications">{this.state.unreadNotifications}</span>
          </a></li>
          <li><a href={urls.get('search')} className="search icon">Search</a></li>
        </ul>
      </footer>
    );
  },

  componentDidMount: function() {
    this.getNotifications();
    setInterval(this.getNotifications, 60000);
  }
});

module.exports = Footer;
