'use strict';

var React = require('react');
var gravatar = require('../utils/gravatar');
var urls = require('../urls');

var UserDetail = React.createClass({
  render: function() {
    var imgStyles = {
      'borderRadius': '50%',
      'height': '24px',
      'transition': 'all .5s cubic-bezier(0.250,0.460,0.450,0.940)'
    }
    var nameStyles = {
      'display': 'none'
    }
    return (<a href={urls.get('user:detail', {'user_id': this.props.userId})} className="user-thumbnail avatar">
              <img src={gravatar.get(this.props.email)} style={imgStyles} />
              <span style={nameStyles}>{this.props.name}</span>
        </a>)
  }
});

module.exports = UserDetail;