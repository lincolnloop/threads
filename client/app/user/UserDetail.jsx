'use strict';

var React = require('react');

var UserDetail = React.createClass({

  render: function() {

    return (<div className="content-view">
        <h2>{this.props.user.name}</h2>
        <p>{this.props.user.email}</p>
      </div>)
  }
});

module.exports = UserDetail;