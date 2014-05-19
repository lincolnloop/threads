'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');

var Header = React.createClass({
  render: function () {
    log.debug('NavView:render');
    var actionClass = 'action';
    if (this.props.discussion) {
      actionClass += ' back';
    }
    return (
      <header id="top-nav">
        <div className="wrapper">
          <span className={actionClass}>
            {this.props.back ? <a className="back" href={this.props.back}>
              <i className="icon icon-back"></i><span>Back</span>
            </a> : null}
          </span>
          <span className="title">{this.props.title}</span>
          <span className={actionClass}>
            <a className="search">Search</a>
          </span>
        </div>
      </header>
    );
  }
});

module.exports = Header;
