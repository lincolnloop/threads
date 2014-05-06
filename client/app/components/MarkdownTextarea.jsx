'use strict';

// This is stored under app/components because it can/will
// be a reusable component in the near future (published to npm)
// with no need for AJAX previews.
var $ = require('jquery');
var React = require('react');
var urls = require('../urls');
var config = require('../utils/config');

var MarkdownView = React.createClass({

  getRawValue: function() {
    // Get raw value for the textarea
    return this.refs.textarea.getDOMNode().value.trim();
  },

  preview: function() {
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

  stopPreview: function() {
    this.setState({'previewValue': null});
  },

  getInitialState: function() {
    return {
      'previewValue': null,
      'rawValue': this.props.defaultValue ? this.props.defaultValue : null
    };
  },
  render: function() {
    // render preview and textarea separately.
    var defaultValue = this.props.data && this.props.data.raw_body;
    return (
      <div className="markdown-textarea">
        <ul className="accordion-tabs">
          <li className="tab-header-and-content">
            <a onClick={this.stopPreview} className="tab-link is-active">Write</a>
            <section className="is-open">
              <textarea ref="textarea" 
                        placeholder={this.props.placeholder}
                        defaultValue={this.state.rawValue}
                        required={!!this.props.required} />
            </section>
          </li>
          <li className="tab-header-and-content">
            <a onClick={this.preview} className="tab-link">Preview</a>
            <section className="is-open">
              <div className="preview-content"
                   dangerouslySetInnerHTML={{'__html': this.state.previewValue}}>
              </div>
            </section>
          </li>
        </ul>
      </div>
    )
  }
});

module.exports = MarkdownView;
