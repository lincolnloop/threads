'use strict';

var _ = require('underscore');
var classSet = require('react/lib/cx');
var log = require('loglevel');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var OrganizationList = require('../teams/OrganizationList.jsx');
var store = require('../store');
var teamUtils = require('../teams/utils');
var urls = require('../urls');
var Header = require('./SmallHeader.jsx');
var Footer = require('./SmallFooter.jsx');

var AppView = React.createClass({

  getInitialState: function() {
    log.info('MediumAppView:getInitialState');
    return {}
  },

  render: function() {
    log.info('AppView:render', this.state.transition);

    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);
    var user = store.find('users', localStorage.getItem('user'));
    var notificationClasses = classSet({
      'icon': true,
      'user-notifications': true,
      'is-unread': this.state.unreadNotifications ? true : false
    });

    return (
      <section className="app medium">
        <nav className="nav-main">
          <ul className="nav-settings">
            <li><a href="/" className="home icon">Home</a></li>
            <li><a href={urls.get('notifications')} className={notificationClasses}>
              <span className="notifications">{this.state.unreadNotifications}</span>
            </a></li>
            <li><a className="settings icon">Settings</a></li>
          </ul>
          {OrganizationList({'organizations': organizations})}
        </nav>
        <div className="content-main">
          {this.props.main}
        </div>
      </section>
    );
  },

  componentDidUpdate: function() {
    var contentNodes = document.getElementsByClassName('content');
    if (contentNodes.length) {
      // scroll document to top when doing a page transition
      // TODO: Apply this to the new content page only
      window.scrollTo(0,0);
    }
  }
});

window.store = store;

module.exports = AppView;
