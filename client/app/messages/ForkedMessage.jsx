'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var classSet = require('react/lib/cx');
var clientconfig = require('clientconfig');
var log = require('loglevel');
var React = require('react');
var store = require('../store');
var urls = require('../urls');
var MessageHeader = require('./MessageHeader.jsx');
var MessageContent = require('./MessageContent.jsx');

var ForkedMessageView = React.createClass({

  render: function() {
    var message = store.find('messages', this.props.message.url);
    var user = store.find('users', message.user);
    return (
      <div className="message-container message-forked">
        <div className="forked-label"><div className="forked-link">Forked</div></div>
        <MessageHeader date={message.date_created} user={message.user} handleCollapse={this.props.handleCollapse} />
        <MessageContent body={message.body} />
      </div>
    );
  }
});

module.exports = ForkedMessageView;
