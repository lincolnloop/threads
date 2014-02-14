"use strict";

var _ = require('underscore');
var React = require('react');

var MessageContentView = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.data.body !== nextProps.data.body;
  },
  render: function () {
    return <div className="content"  dangerouslySetInnerHTML={{__html: this.props.data.body}}></div>;
  }
});

module.exports = MessageContentView;