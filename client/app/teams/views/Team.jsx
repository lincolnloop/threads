'use strict';

var React = require('react');
var urls = require('../../urls');

var TeamView = React.createClass({
  render: function () {
    var unread = this.props.unread ? this.props.unread : '';
    var url = urls.get('team:detail', {'slug': this.props.slug});
    return (
      <li key={this.props.slug}>
        <a href={url}>
          {this.props.name}{' '}
          <span className="unread-count">{unread}</span>
        </a>
      </li>
    );
  }
});

module.exports = TeamView;
