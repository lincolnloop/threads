'use strict';

var _ = require('underscore');
var classSet = require('react/lib/cx');
var log = require('loglevel');
var React = require('react');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var Header = require('./SmallHeader.jsx');
var Footer = require('./SmallFooter.jsx');

var SidebarView = React.createClass({

  getInitialState: function() {
    return {
      'settings-expanded': false
    }
  },

  render: function() {

    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);
    var user = store.find('users', localStorage.getItem('user'));
    var notificationClasses = classSet({
      'icon': true,
      'user-notifications': true,
      'is-unread': this.state.unreadNotifications ? true : false
    });

    return (
      <nav className="nav-main">
        <ul className="nav-settings">
          <li><a href="/" className="home icon">Home</a></li>
          <li><a href={urls.get('notifications')} className={notificationClasses}>
            <span className="notifications">{this.state.unreadNotifications}</span>
          </a></li>
          <li>
            <a className="settings icon">Settings</a>
            <div className="settings-overlay" onClick={this.props.handleLayoutClick}>
              <a href="#" data-layout="auto">Auto</a>
              <a href="#" data-layout="compact">Compact</a>
              <a href="#" data-layout="focused">Focused</a>
              <a href="#" data-layout="full">Full</a>
            </div>
          </li>
        </ul>
        {OrganizationList({'organizations': organizations})}
      </nav>
    );
  }
});

window.store = store;

module.exports = SidebarView;
