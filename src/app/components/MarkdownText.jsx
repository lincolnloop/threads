"use strict";

var $ = require('jquery');
var React = require('react');
var urls = require('../urls');

var MarkdowText = React.createClass({
  getInitialState: function () {
    return {
      previewValue: null,
      rawValue: this.props.value ? this.props.value : null
    };
  },
  render: function () {
    // render preview and textarea separately.
    var defaultValue = this.props.data && this.props.data.raw_body,
      nodes = [];
    if (this.state.previewValue) {
      // if we have a previewValue show a preview
      // -----------
      // Preview div
      nodes.push(
        React.DOM.div({
          className: 'preview',
          dangerouslySetInnerHTML: {'__html': this.state.previewValue}
        }),
        // Preview button
        React.DOM.a({
          children: 'Close Preview',
          onClick: this.stopPreview
        })
      )
    } else {
      // Otherwise show the textarea
      nodes.push(
        // Textarea
        React.DOM.textarea({
          ref: 'textarea',
          placeholder: this.props.placeholder,
          value: this.state.rawValue,
          required: !!this.props.required
        }),
        // Stop preview button
        React.DOM.a({
          children: 'Preview',
          onClick: this.preview
        })
      )
    }
    return (
      React.DOM.div(null, nodes)
    )
  },
  getRawValue: function () {
    // Get raw value for the textarea
    return this.refs.textarea.getDOMNode().value.trim();
  },
  preview: function () {
    // Fetch the preview from the server
    $.ajax({
      type: 'POST',
      url: window.app.config.apiUrl + urls.get('api:message:preview'),
      contentType: 'application/json',
      data: JSON.stringify({'raw_body': this.getRawValue()}),
      headers: {
        Authorization: 'Token ' + localStorage.apiKey
      },
      success: function (evt) {
        // TODO: Fix the API. 
        // It's returning an array for the body.
        this.setState({previewValue: evt.body[0], rawValue: this.getRawValue()});
      }.bind(this)
    });
  },
  stopPreview: function () {
    this.setState({previewValue: null});
  }
});

module.exports = MarkdowText;