'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');
var urls = require('../urls');

var Header = React.createClass({
  historyBack: function() {
    try {
      window.history.back();
    } catch(e) {
      // redirect to /
    }
  },
  render: function () {
    var backAttrs = {
      'className': 'back',
      'href': this.props.back !== 'history' ? this.props.back : null,
      'onClick': this.props.back === 'history' ? this.historyBack : null,
    }
    return (
      <header id="top-nav">
        <div className="wrapper">
          <span className="action">
            {this.props.back ? React.DOM.a(backAttrs,
              React.DOM.i({'className': "icon icon-back"}),
              React.DOM.span(null, 'Back')
            ) : null}
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
