'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');

var NavView = React.createClass({
  render: function () {
    log.debug('NavView:render');
    var actionClass = 'action';
    if (this.props.discussion) {
      actionClass += ' back';
    }
    return (
      <div className="wrapper">
        <span className={actionClass}>
          <a className="expand" onClick={this.props.toggleTeamNav}>Teams</a>
          <a className="back">Back</a>
        </span>
        <span className="title">{this.props.title}</span>
        <a className="search">Search</a>
      </div>
    );
  }
});

module.exports = NavView;