'use strict';

var _ = require('underscore');
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
    var discussion = this.state.discussion;
    var team = discussion ? store.find('teams', discussion.team) : null;
    return (
      <div className="forked-label">
        {discussion ? <h2>
          <a href={urls.get('discussion:detail', team.slug, discussion.id, discussion.slug)}>
            {discussion.title}
          </a>
        </h2> : <h2>&nbsp;</h2>}
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
