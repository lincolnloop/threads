'use strict';

var $ = require('jquery');
var React = require('react');
var Message = require('../models/Message');
var urls = require('../../urls');

var MessageEditView = React.createClass({
  getInitialState: function () {
    return {preview: null};
  },
  editMessage: function (rawBody) {
    var message = this.props.discussion.getMessage(this.props.data.url);
    message.set('raw_body', rawBody);
    message.save();
    this.props.done();
  },
  createMessage: function (rawBody) {
    var message = new Message({
        raw_body: rawBody,
        parent: this.props.parent
      });
    message.save();
    this.props.discussion.messages.add(message);
    this.props.done();
  },
  createDiscussion: function (rawBody) {
    // the parent component handles the rest
    this.props.done(rawBody);
  },
  submit: function (event) {
    console.log('MessageEditView:submit');
    event.preventDefault();
    var message = this.refs.message.getDOMNode().value.trim();
    if (this.props.data) {
      this.editMessage(message);
    } else if (this.props.parent) {
      this.createMessage(message);
    } else {
      this.createDiscussion(message);
    }
  },
  loadPreview: function (rawBody, callback) {
    $.ajax({
      type: 'POST',
      url: window.app.config.apiUrl + urls.get('api:message:preview'),
      contentType: 'application/json',
      data: JSON.stringify({'raw_body': message}),
      headers: {
        Authorization: 'Token ' + localStorage.apiKey
      },
      success: callback
    });
  },
  preview: function () {
    console.log('MessageEditView:preview');
    var message = this.refs.message.getDOMNode().value.trim();
    if (this.state.preview) {
      this.setState({preview: null});
    } else {
      this.loadPreview(message, function (message) {
        // FIXME: why is this returning an array for body?
        this.setState({preview: message});
      }.bind(this));
    }
  },
  render: function () {
    console.log('MessageEditView:render');
    var defaultValue = this.props.data && this.props.data.raw_body,
      previewClass = this.state.preview ? 'preview' : 'preview hide',
      textareaClass = this.state.preview ? 'hide' : '';

    return (
      <form onSubmit={this.submit}>
      <textarea ref="message" className={textareaClass} defaultValue={defaultValue} placeholder="Comment..."></textarea>
      <div className={previewClass} dangerouslySetInnerHTML={{__html: this.state.preview}}></div>
      <input type="submit" />{' '}
      <a onClick={this.preview}>{this.state.preview ? 'Back to Edit' : 'Preview' }</a>{' '}
      <a onClick={this.props.done}>cancel</a>
      </form>
    );
  }
});

module.exports = MessageEditView;