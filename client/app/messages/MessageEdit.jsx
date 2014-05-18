'use strict';

var _ = require('underscore');
var React = require('react');
var Backbone = require('backbone');
var log = require('loglevel');
var urls = require('../urls');
var MarkdownView = require('../components/MarkdownTextarea');
var Header = require('../components/Header.jsx');

var MessageEditView = React.createClass({

  handleSubmit: function() {
    // handle message edit submit
    // clone the current message object
    // and extend it with the new body value
    var data = _.extend(_.clone(this.state.message), {
      'raw_body': this.refs.comment.getRawValue()
    });
    store.update('messages', data).then(function(message) {
      log.info('MessageEdit:success');
      // redirect
      var kwargs = urls.resolve(window.location.pathname).kwargs;
      var url = urls.get('discussion:detail:message', _.extend(kwargs, {'message_id': message.id}));
      Backbone.history.navigate(url, {'trigger': true});
    }.bind(this));
    return false;
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
    var back = urls.get('discussion:detail:message', urls.resolve(window.location.pathname).kwargs);
    if (this.state.message === null) {
      return (
        <div>loading..</div>
      )
    }
    return (
      <div className="message-reply">
        <Header title="Edit message"
                back={back} />
        <form className="content form-view" onSubmit={this.handleSubmit}>
            <div className="form-view-actions">
            <a href={back} className="btn btn-cancel">Cancel</a>
            <button type="submit" className="btn btn-submit">Update</button>
            </div>
            <div className="form-view-fields">
            <MarkdownView placeholder="Comment.."
                            ref="comment"
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
