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
    // stores mentions in a data attribute for the textarea
    // this is what we need to send to the server
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
      }.bind(this),
      error: function (error) {
        this.setState({'errormsg': error.responseJSON.raw_body});
      }.bind(this)
    });
  },

  stopPreview: function() {
    this.setState({'previewValue': null});
  },

  getInitialState: function() {
    return {
      'previewValue': null,
      'errormsg': null,
      'rawValue': this.props.value ? this.props.value : null
    };
  },

  render: function() {


    if (!this.state.previewValue) {
      var contentArea = <section>{this.props.pre ? this.props.pre : null}
                          <textarea ref="textarea"
                                    placeholder={this.props.placeholder}
                                    defaultValue={this.state.rawValue}
                                    onChange={this.props.onChange}
                                    required={!!this.props.required} />
                          {this.props.post ? this.props.post : null}
                            <a onClick={this.preview} className="preview-link">Preview</a>
                        </section>
    } else {
      var contentArea = <section>
                          <div className="preview-content"
                            dangerouslySetInnerHTML={{'__html': this.state.previewValue}}>
                          </div>
                            <a onClick={this.stopPreview} className="preview-link">Back to edit</a>
                        </section>
    }

    var errorArea ;

    if(this.state.errormsg) {
      errorArea = <div>{this.state.errormsg}</div>
    }
    // render preview and textarea separately.
    var submitLabel = this.props.submitLabel ? this.props.submitLabel : 'Submit';
    return (
      <div className="markdown-textarea">
        {contentArea}
        {errorArea}
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
