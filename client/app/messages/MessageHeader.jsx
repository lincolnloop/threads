'use strict';

var log = require('loglevel');
var moment = require('moment');
var React = require('react');
var store = require('../store');
var gravatar = require('../utils/gravatar');
var urls = require('../urls');

var MessageHeader = React.createClass({

  render: function() {
    var user = store.find('users', this.props.user);
    // generate permalink
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    kwargs.message_id = this.props.messageId;
    var permalink = urls.get('discussion:detail:message', kwargs);
    if (!user) {
      user = localStorage.getItem('anonUser');
    }
    // convert to Date applies local time zone
    var messageTime = new Date(this.props.date);

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
          <a href={permalink} className="permalink">
            <time className="timeago" dateTime={messageTime}>{moment(messageTime).fromNow()}</time>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = MessageHeader;
