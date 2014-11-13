'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var MarkdownView = require('../components/MarkdownTextarea.jsx');

var MessageReplyView = React.createClass({

  handleSubmit: function() {
    var data = {
      'raw_body': this.refs.comment.getRawValue(),
      'parent': this.props.parent_url,
      'read': true,
      'user': localStorage.getItem('user')
    };
    store.add('messages', data).then(function(message) {
      log.info('MessageReply:success');
      // redirect
      var kwargs = urls.resolve(window.location.pathname).kwargs;
      var url = urls.get('discussion:detail:message', _.extend(kwargs, {'message_id': message.id}));
      app.history.navigate(url, {'trigger': true});
    }.bind(this));
    return false;
  },

  toggleExpand: function() {
    this.setState({'expand': !this.state.expand});
  },

  getInitialState: function() {
    return {
      'expand': true
    }
  },

  render: function() {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    var team = store.find('teams', {'slug': kwargs.team_slug});
    var message = store.find('messages', {'id': parseInt(kwargs.message_id)});
    var author = message ? store.find('users', message.user) : null;
    return (
      <div className="message-reply content-view">
        <form className="form-view" onSubmit={this.handleSubmit}>
          {message ? <div className="message">

            <div className="message-container" onClick={this.toggleExpand}>

            <div className="message-header">
              <a className="collapse-button expand">{!this.state.expand ? "Expand" : "Collapse"}</a>
              <div className="avatar">
                <img src={gravatar.get(author.email)} />
              </div>
              <div className="username">{author.name}</div>
              <div className="date">
                <a href="/lincoln-loop/12461/potential-project-united-nations-world-food-programme-wfp/#89624" 
                   className="permalink">
                  <time className="timeago" datetime="2014-02-06T22:02:23.791">{moment(message.date_created).fromNow()}</time>
                </a>
              </div>
            </div>
              {this.state.expand ? <div className="message-content">
                <div dangerouslySetInnerHTML={{__html: message.body}} />
              </div> : null}
            </div>
          </div> : null}
          <div className="form-view-actions">
          </div>
            <div className="form-view-fields">
            <MarkdownView placeholder="Comment.."
                          submitLabel="Reply"
                          teamUrl={team.url}
                          ref="comment"
                          required />
          </div>
        </form>
      </div>
    );
  }
});

module.exports = MessageReplyView;
