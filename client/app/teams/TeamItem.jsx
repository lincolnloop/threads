'use strict';

var React = require('react');
var urls = require('../urls');
var classSet = require('react/lib/cx');

var TeamView = React.createClass({
  render: function () {
    var linkStyle = {
      'fontSize': '13px',
      'paddingTop': '8px',
      'paddingBottom': '8px',
      'paddingLeft': '24px',
      'height': '13px',
      'margin': '2px 0'
    }
    var unread = this.props.unread ? this.props.unread : '';
    var url = urls.get('team:detail', {
      'slug': this.props.slug
    });
    var classes = classSet({
      'unread-item': true,
      'unread': this.props.unread !== 0 ? true : false
    });
    return (
      <li key={this.props.slug} className="team-item" data-slug={this.props.slug}>
        <a href={url} style={linkStyle} title={this.props.name}>
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
