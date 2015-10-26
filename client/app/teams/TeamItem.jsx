'use strict';

var React = require('react');
var urls = require('../urls');
var classnames = require('classnames');

var TeamView = React.createClass({
  render: function () {
    var unread = this.props.unread ? this.props.unread : '';
    var url = urls.get('team:detail', {
      'slug': this.props.slug
    });
    var classes = classnames({
      'unread-item': true,
      'unread': this.props.unread !== 0 ? true : false
    });
    return (
      <li key={this.props.slug} className="nav-item" data-slug={this.props.slug}>
        <a href={url} title={this.props.name}>
          <span className="item-content">{this.props.name}{' '}<span className={classes}>
              <span className="unread-count">{this.props.unread}</span>
            </span>
          </span>
        </a>
      </li>
    );
  }
});

module.exports = TeamView;
