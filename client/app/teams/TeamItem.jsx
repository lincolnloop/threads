'use strict';

var React = require('react');
var urls = require('../urls');
var classSet = require('react/lib/cx');

var TeamView = React.createClass({
  render: function () {
    var unread = this.props.unread ? this.props.unread : '';
    var url = urls.get('team:detail', {
      'slug': this.props.slug
    });
    var classes = classSet({
      'unread-item': true,
      'unread': this.props.unread !== '' ? true : false
    });
    return (
      <li key={this.props.slug} className="nav-item">
        <a href={url}>
          <div className="item-content">{this.props.name}{' '}<span className={classes}>
              <span className="unread-count">{this.props.unread}</span>
            </span></div>
        </a>
      </li>
    );
  }
});

module.exports = TeamView;
