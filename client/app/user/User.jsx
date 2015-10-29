'use strict';

var React = require('react');
var gravatar = require('../utils/gravatar');
var urls = require('../urls');

var UserDetail = React.createClass({
  render: function() {
    return (<a href={urls.get('user:detail', {'user_id': this.props.userId})} className="user-thumbnail avatar">
              <img src={gravatar.get(this.props.email)} />
              <span>{this.props.name}</span>
        </a>)
  }
});

module.exports = UserDetail;