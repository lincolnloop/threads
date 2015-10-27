'use strict';

// This is stored under app/components because it can/will
// be a reusable component in the near future (published to npm)
// with no need for AJAX previews.
var $ = require('jquery');
// mentions input reqs
// TODO: Fix this
window._ = require('underscore');
window.jQuery = $;
require('../../vendor/jquery.events.input');
require('../../vendor/jquery.elastic');
require('../../vendor/jquery.textareaHelper');
require('../../vendor/jquery.mentionsInput.custom');
// component reqs
var classnames = require('classnames');
var React = require('react');
var ReactDOM = require('react-dom');
var store = require('../store');
var urls = require('../urls');
var gravatar = require('../utils/gravatar');
var config = require('../utils/config');

var MarkdownView = React.createClass({

  getRawValue: function() {
    var $textarea = $(ReactDOM.findDOMNode(this.refs.textarea));
    return $textarea.data('messageText');
  },

  getTabClass: function(isActive) {
    return classnames({
      'tab-header-and-content': true,
      'is-active': !!isActive
    });
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
    var submitLabel = this.props.submitLabel ? this.props.submitLabel : 'Submit';
    return (
      <div className="markdown-textarea">
        <ul className="accordion-tabs">
          <li className={this.getTabClass(!this.state.previewValue)}>
            <a onClick={this.stopPreview} className="tab-link">Write</a>
            <section>
            {this.props.pre ? this.props.pre : null}
              <textarea ref="textarea"
                        placeholder={this.props.placeholder}
                        defaultValue={this.state.rawValue}
                        required={!!this.props.required} />
            {this.props.post ? this.props.post : null}
            </section>
          </li>
          <li className={this.getTabClass(this.state.previewValue)}>
            <a onClick={this.preview} className="tab-link">Preview</a>
            <section>
              <div className="preview-content"
                   dangerouslySetInnerHTML={{'__html': this.state.previewValue}}>
              </div>
            </section>
          </li>
        </ul>
        <button type="submit" className="btn btn-submit">{submitLabel}</button>
      </div>
    )
  },

  componentDidMount: function() {
    var $textarea = $(ReactDOM.findDOMNode(this.refs.textarea));
    $textarea.mentionsInput({
      defaultTriggerChar: '@',
      onDataRequest: function (mode, query, callback) {
        var team = store.find('teams', this.props.teamUrl);
        var user;
        var data;
        var members = _.map(team.members, function(member) {
          user = store.find('users', member.user);
          return {
            'id': user.url,
            'name': user.name,
            'avatar': gravatar.get(user.email),
            'type': 'user'
          }
        });
        data = _.filter(members, function (user) {
          return user.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
        callback.call(this, data);
      }.bind(this)
    });
  }
});

module.exports = MarkdownView;
