'use strict';

var _ = require('underscore');
var classnames = require('classnames');
var log = require('loglevel');
var React = require('react');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var layoutActions = require('../layout/actions');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var SelectorOverlay = require('./SelectorOverlay.jsx');
var Logo = require('../components/Logo.jsx');
var SidebarView = React.createClass({

  handleClose() {
    layoutActions.closeNav();
  },

  getInitialState() {
    return {
      unreadNotifications: false
    }
  },

  render() {
    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);
    var user = store.find('users', localStorage.getItem('user'));
    var notificationClasses = classnames({
      'icon': true,
      'user-notifications': true,
      'is-unread': this.state.unreadNotifications ? true : false
    });

    return (
      <nav className='nav-main'>
        <Logo />
        <a onClick={this.handleClose}>X</a>
        <header className='nav-settings'>
          <ul>
            <li>
              <a href={urls.get('notifications')} className={notificationClasses}>
                <span className='notifications'>{this.state.unreadNotifications}</span>
              </a>

            </li>
            <SelectorOverlay handleLayoutClick={this.props.handleLayoutClick} />
          </ul>
        </header>
        {React.createElement(OrganizationList, {
          'organizations': organizations
        })}
      </nav>
    );
  }
});

module.exports = SidebarView;
