'use strict';

// This is stored under app/components because it can/will
// be a reusable component in the near future (published to npm)
// with no need for AJAX previews.
var $ = require('jquery');
var React = require('react');
var urls = require('../urls');
var config = require('../utils/config');

var MarkdownView = React.createClass({
  getInitialState: function () {
    return {
      'previewValue': null,
      'rawValue': this.props.defaultValue ? this.props.defaultValue : null
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
          'className': 'preview-content',
          'dangerouslySetInnerHTML': {'__html': this.state.previewValue}
        }),
        // Preview button
        React.DOM.a({
          'className': 'preview preview-stop',
          'children': 'Close Preview',
          'onClick': this.stopPreview
        })
      )
    } else {
      // Otherwise show the textarea
      nodes.push(
        // Textarea
        React.DOM.textarea({
          'ref': 'textarea',
          'placeholder': this.props.placeholder,
          'defaultValue': this.state.rawValue,
          'required': !!this.props.required
        }),
        // Stop preview button
        React.DOM.a({
          'className': 'preview preview-start',
          'children': 'Preview',
          'onClick': this.preview
        })
      )
    }
    return (
      React.DOM.div({'className': 'markdown-textarea'}, nodes)
    )
  },
  getRawValue: function () {
    // Get raw value for the textarea
    return this.refs.textarea.getDOMNode().value.trim();
  },
  preview: function () {
    // Fetch the preview from the server
    $.ajax({
      'type': 'POST',
      'url': config.apiUrl + urls.get('api:message:preview'),
      'contentType': 'application/json',
      'data': JSON.stringify({'raw_body': this.getRawValue()}),
      'headers': {
        'Authorization': 'Token ' + localStorage.apiKey
      },
      success: function (evt) {
        // TODO: Fix the API.
        // It's returning an array for the body.
        this.setState({'previewValue': evt.body[0], 'rawValue': this.getRawValue()});
      }.bind(this)
    });
  },
  stopPreview: function () {
    this.setState({'previewValue': null});
  }
});

module.exports = MarkdownView;
