'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var urls = require('../urls');
var shortcuts = require('../utils/shortcuts');
var MarkdownView = require('../components/MarkdownTextarea.jsx');

var MessageEditView = React.createClass({

  handleSubmit: function(evt) {
    evt.preventDefault();
    // handle message edit submit
    // clone the current message object
    // and extend it with the new body value
    var data = _.extend(_.clone(this.state.message), {
      'raw_body': this.refs.comment.getRawValue()
    });
    store.update('messages', data).then(function(message) {
      log.info('MessageEdit:success');
      // redirect
      var url = urls.get('discussion:detail:message', _.extend(shortcuts.getURIArgs(), {'message_id': message.id}));
      app.history.navigate(url, {'trigger': true});
    }.bind(this));
  },

  setMessage: function() {
    log.info('MessageEdit:setMessage');
    // TODO: Fix the need to run parseInt on amygdala
    var message = store.find('messages', {'id': parseInt(this.props.message_id)}) || null;
    this.setState({
      'message': message
    });
  },

  getInitialState: function() {
    return {
      'message': null
    };
  },

  componentWillMount: function() {
    this.setMessage();
  },

  render: function() {
    if (this.state.message === null) {
      return (
        <div>loading..</div>
      )
    }
    var team = shortcuts.getActiveTeam();
    return (
      <div className="message-reply">
        <form className="form-view" onSubmit={this.handleSubmit}>
            <div className="form-view-fields">
            <MarkdownView placeholder="Comment.."
                            ref="comment"
                            teamUrl={team.url}
                            submitLabel="Update"
                            defaultValue={this.state.message.raw_body}
                            required />
          </div>
        </form>
      </div>
    );
  },

  componentDidMount: function() {
    var messageUrl = urls.get('api:message:detail', {'message_id': this.props.message_id});
    store.get('messages', {}, {'url': messageUrl}).then(this.setMessage);
  }
});

module.exports = MessageEditView;
