'use strict';

var React = require('react');
var gravatar = require('../utils/gravatar');

var UserDetail = React.createClass({

  getInitialState: function() {
    return {
      'messages': []
    }
  },

  componentWillMount: function() {
    store.get('messages', {'user': this.props.user.id}).done(function(response) {
      this.setState({
        'messages': response.results
      })
    }.bind(this))
  },

  render: function() {
    var user = this.props.user;

    return (<div className="content-view">
        <img src={gravatar.get(user.email)} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <h3>Latest messages</h3>
        {this.state.messages}
      </div>)
  }
});

module.exports = UserDetail;