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
      'configurationOverlay': false
    }
  },

  toggleConfigurationOverlay: function(event) {
    this.setState({
      'configurationOverlay': !this.state.configurationOverlay
    });
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
    var overlayClasses = classSet({
      'configuration-overlay': true,
      'active': this.state.configurationOverlay
    });

    return (
      <nav className="nav-main">
        <ul className="nav-settings">
          <li><a href="/" className="home icon">Home</a></li>
          <li><a href={urls.get('notifications')} className={notificationClasses}>
            <span className="notifications">{this.state.unreadNotifications}</span>
          </a></li>
          <li className="configuration">
            <a className="settings icon" onClick={this.toggleConfigurationOverlay}>Settings</a>
            <div className={overlayClasses} onClick={this.props.handleLayoutClick}>
              <a data-layout="auto">Auto</a>
              <a data-layout="compact">Compact</a>
              <a data-layout="focused">Focused</a>
              <a data-layout="full">Full</a>
            </div>
          </li>
        </ul>
        {OrganizationList({
          'organizations': organizations
        })}
      </nav>
    );
  }
});

window.store = store;

module.exports = SidebarView;
