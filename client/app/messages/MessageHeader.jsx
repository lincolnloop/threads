'use strict';

var moment = require('moment');
var React = require('react');
var gravatar = require('../utils/gravatar');

var MessageHeader = React.createClass({

  render: function() {
    var message = this.props.message;
    var user = this.props.user;
    return (
      <div className="message-header">
        <div className="avatar">
          <img src={gravatar.get(user.email)} />
        </div>
        <div className="cite"></div>
        <a className="collapse-button" onClick={this.props.handleCollapse}>Collapse</a>
        <div className="username">{user.name}</div>
        <div className="date">
          <a href="/lincoln-loop/12461/potential-project-united-nations-world-food-programme-wfp/#89624" 
             className="permalink">
            <time className="timeago" dateTime={message.date_created}>{moment(message.date_created).fromNow()}</time>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = MessageHeader;
