'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');

var TopNavView = React.createClass({
  render: function () {
    log.debug('NavView:render');
    var actionClass = 'action';
    if (this.props.discussion) {
      actionClass += ' back';
    }
    return (
      <div className="wrapper">
        <span className={actionClass}>

          {this.props.backLink ? <a className="back" href={this.props.backLink}>
            <i className="icon icon-back"></i><span>Back</span>
          </a> : ''}

        </span>
        <span className="title">{this.props.title}</span>
        <a className="search">Search</a>
      </div>
    );
  }
});

module.exports = TopNavView;
