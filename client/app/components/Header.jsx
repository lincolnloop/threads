'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');
var urls = require('../urls');

var Header = React.createClass({
  render: function () {
    log.debug('NavView:render');
    return (
      <header id="top-nav">
        <div className="wrapper">
          <span className="action">
            {this.props.back ? <a className="back" href={this.props.back}>
              <i className="icon icon-back"></i><span>Back</span>
            </a> : null}
          </span>
          <span className="title">{this.props.title}</span>
          <span className="action">
            <a href={urls.get('notifications')} className="notifications">{this.props.unreadNotifications}</a>
            <a className="search">Search</a>
          </span>
        </div>
      </header>
    );
  }
});

module.exports = Header;
