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
    log.info(message ? message.body : null);
    return (
      <div className="message-reply content-view">
        <form className="form-view" onSubmit={this.handleSubmit}>
          {message ? <div className="message">

            <div className="message-container">

            <div className="message-header">
              <div className="avatar">
                <img src={gravatar.get(author.email)} />
              </div>
              <div className="username">{author.name}</div>
            </div>
              <div className="message-content">
                <div dangerouslySetInnerHTML={{__html: message.body}} />
              </div>
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
