'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var store = require('../store');
var MarkdownView = require('../components/MarkdownTextarea.jsx');

var MessageReplyForm = React.createClass({
  handleSubmit: function(evt) {
    evt.preventDefault();
    var data = {
      'raw_body': this.refs.comment.getRawValue(),
      'parent': this.props.parent_url,
      'read': true,
      'user': localStorage.getItem('user')
    };
    store.add('messages', data).then(function(message) {
      log.info('MessageReply:success');
      // redirect to discussion detail
      var kwargs = urls.resolve(window.location.pathname).kwargs;
      var url = urls.get('discussion:detail:message', _.extend(kwargs, {'message_id': message.id}));
      app.history.navigate(url, {'trigger': true});
    }.bind(this));
  },

  render: function() {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    var team = store.find('teams', {'slug': kwargs.team_slug});
    return (
      <div className="message-reply content-view">
        <form className="form-view" onSubmit={this.handleSubmit}>
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

module.exports = MessageReplyForm;
