'use strict';

var _ = require('underscore');
var React = require('react');
var log = require('loglevel');


var HelpItem = React.createClass({
  render: function () {
    return (
      <div className="help-anchor">
        <span className="help-anchor-pulse"></span>
        <b className="help-anchor-content">5</b>
      </div>
    );
  }
});

module.exports = HelpItem;
