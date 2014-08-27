'use strict';

var React = require('react');
var gravatar = require('../utils/gravatar');

var UserDetail = React.createClass({

  render: function() {
    var user = this.props.user;

    return (<div className="content-view">
        <img src={gravatar.get(user.email)} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>)
  }
});

module.exports = UserDetail;