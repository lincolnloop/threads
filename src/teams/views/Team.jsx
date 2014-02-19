'use strict';

var React = require('react');

var Team = React.createClass({
  render: function () {
    var unread = this.props.unread ? this.props.unread : '';
    return (
      <li key={this.props.slug}>
        <a href={this.props.link}>
          {this.props.name}{' '}
          <span className="unread-count">{unread}</span>
        </a>
      </li>
    );
  }
});

module.exports = Team;