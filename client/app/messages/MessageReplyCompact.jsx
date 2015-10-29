'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var store = require('../store');
var MessageReplyForm = require('./MessageReplyForm.jsx');

// This is only used on the single pane/compact/mobile view
var MessageReplyCompact = React.createClass({
  getInitialState: function() {
    return {
      'expand': true
    }
  },

  componentWillMount: function () {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    var message = store.find('messages', {'id': parseInt(kwargs.message_id)});
    var author = message ? store.find('users', message.user) : null;

    this.setState({
      message: message,
      author: author
    });
  },

  render: function() {
    return (
      <div className="message-reply content-view">
        {this.state.message ? <div className="message">
          <div className="message-container" onClick={this.toggleExpand}>

          <div className="message-header">
            <a className="collapse-button expand">{!this.state.expand ? "Expand" : "Collapse"}</a>
            <div className="avatar">
              <img src={gravatar.get(this.state.author.email)} />
            </div>
            <div className="username">{this.state.author.name}</div>
            <div className="date">
              <a href="/lincoln-loop/12461/potential-project-united-nations-world-food-programme-wfp/#89624"
                 className="permalink">
                <time className="timeago" dateTime="{message.date_created}">{moment.utc(this.state.message.date_created).local().fromNow()}</time>
              </a>
            </div>
          </div>
            {this.state.expand ? <div className="message-content">
              <div dangerouslySetInnerHTML={{__html: this.state.message.body}} />
            </div> : null}
          </div>
        </div> : null}
        <MessageReplyForm parent_url={this.props.parent_url} />
      </div>
    );
  }
});

module.exports = MessageReplyCompact;
