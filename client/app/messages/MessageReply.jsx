'use strict';

var _ = require('underscore');
var React = require('react');
var Backbone = require('backbone');
var log = require('loglevel');
var urls = require('../urls');
var MarkdownView = require('../components/MarkdownTextarea');
var Header = require('../components/Header.jsx');

var MessageReplyView = React.createClass({

  handleSubmit: function() {
    var data = {
      'raw_body': this.refs.comment.getRawValue(),
      'parent': this.props.parent_url,
      'read': true,
      'user': localStorage.getItem('user')
    };
    store.add('messages', data).then(function(message) {
      log.info('MessageEdit:success');
      // redirect
      var kwargs = urls.resolve(window.location.pathname).kwargs;
      var url = urls.get('discussion:detail:message', _.extend(kwargs, {'message_id': message.id}));
      Backbone.history.navigate(url, {'trigger': true});
    }.bind(this));
    return false;
  },

  render: function() {
    var back = urls.get('discussion:detail:message', urls.resolve(window.location.pathname).kwargs);
    return (
      <div className="message-reply">
        <Header title="Reply to message"
                back={back} />
        <form className="form-view content" onSubmit={this.handleSubmit}>
            <div className="form-view-actions">
            <a href={this.props.cancelLink} className="btn btn-cancel">Cancel</a>
            <button type="submit" className="btn btn-submit">Reply</button>
            </div>
            <div className="form-view-fields">
            <MarkdownView placeholder="Comment.."
                            ref="comment"
                            required />
            </div>
        </form>
      </div>
    );
  }
});

module.exports = MessageReplyView;
