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

  getInitialState: function() {
    return {
      'discussion': null
    }
  },

  render: function() {
    var message = store.find('messages', this.props.message.url);
    var user = store.find('users', message.user);
    return (
      <div className="forked-label">
        {this.state.discussion ? <h2>{this.state.discussion.title}</h2> : <h2>&nbsp;</h2>}
        <div className="message-container message-forked">
          <MessageHeader date={message.date_created} user={message.user} handleCollapse={this.props.handleCollapse} />
          <MessageContent body={message.body} />
        </div>
        <div className="forked-link">Forked</div>
      </div>
    );
  },

  componentDidMount: function() {
    store.get('discussions', {}, {'url': this.props.message.discussion}).done(function() {
      this.setState({
        'discussion': store.find('discussions', this.props.message.discussion)
      });
    }.bind(this));
  }

});

module.exports = ForkedMessageView;
