'use strict';

var moment = require('moment');
var React = require('react');
var store = require('../store');
var gravatar = require('../utils/gravatar');

var MessageHeader = React.createClass({

  render: function() {
    var user = store.find('users', this.props.user);
    return (
      <div className="message-header">
        <div className="avatar">
          <img src={gravatar.get(user.email)} />
        </div>
        <div className="cite"></div>
        {this.props.handleCollapse ? 
          <a className="collapse-button" onClick={this.props.handleCollapse}>Collapse</a>
        : null}
        <div className="username">{user.name}</div>
        <div className="date">
          <a href="/lincoln-loop/12461/potential-project-united-nations-world-food-programme-wfp/#89624" 
             className="permalink">
            <time className="timeago" dateTime={this.props.date}>{moment(this.props.date).fromNow()}</time>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = MessageHeader;
