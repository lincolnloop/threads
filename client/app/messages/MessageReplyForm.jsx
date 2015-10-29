'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var eventsMixin = require('../mixins/eventsMixin');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var store = require('../store');
var MarkdownView = require('../components/MarkdownTextarea.jsx');
var shortcuts = require('../utils/shortcuts');
var cookies = require('../utils/cookies');
var config = require('../utils/config');

var MessageReplyForm = React.createClass({
  mixins: [eventsMixin],

  getInitialState: function () {
    return {
      draft: false,
      team: shortcuts.getActiveTeam(),
      addedAttachments: []
    };
  },

  componentWillMount: function () {
    var draft = localStorage.getItem(this.getDraftId());
    if (draft) {
      this.setState({
        draft: draft
      });
    }
  },

  handleSubmit: function(evt) {
    evt.preventDefault();
    var data = {
      'raw_body': this.state.draft,
      'parent': this.props.parent_url,
      'read': true,
      'user': localStorage.getItem('user')
    };

    if (this.state.addedAttachments.length) {
      data['attachments'] = [];
      for (var i = 0; i < this.state.addedAttachments.length; i++) {
        data['attachments'].push(this.state.addedAttachments[i].url)
      }
    }

    store.add('messages', data).then(function(response) {
      log.info('MessageReply:success');

      // remove draft
      localStorage.removeItem(this.getDraftId());

      // update discussion last message manually
      var root = store.find('messages', response[0].root);
      var discussion;
      if (root) {
        discussion = store.find('discussions', root.discussion);
        if (discussion) {
          // update discussion
          discussion.latest_message = _.clone(root);
        }
      }

      if (this.props.callback) {
        this.emitter.emit('message:add');
        this.props.callback();
      } else {
        // redirect to discussion detail
        var url = urls.get('discussion:detail:message', _.extend(shortcuts.getURIArgs(), {'message_id': message.id}));
        app.history.navigate(url, {'trigger': true});
      }
    }.bind(this));
  },

  getDraftId: function () {
    var kwargs = shortcuts.getURIArgs();
    return 'draft:team:' + kwargs.team_slug + ':discussion:' + kwargs.discussion_id + ':msg:' + this.props.messageId;
  },

  handleFileInput: function (event) {
    console.log('file input',event.target.files)

    //POST file
    var uploadIframe = window.frames.uploadFileIframe,
        data = new FormData();

    uploadIframe.xhr = new XMLHttpRequest();
    var xhr = uploadIframe.xhr;

    data.append('attachment', event.target.files[0]);

    //xhr.upload.addEventListener('progress', this.uploadProgress, false);
    xhr.addEventListener('load', this.uploadSuccess, false);

    //TODO get API URL
    var uploadUrl = config.apiUrl + urls.get('api:fileUpload') + '?format=json';
    xhr.open('POST', uploadUrl, true);
    xhr.setRequestHeader('X-CSRFToken', cookies.getItem('csrftoken'));
    xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('apiKey'));
    xhr.send(data);
  },

  uploadSuccess: function (event) {
    console.log('success!', event.target.responseText)

    var response = JSON.parse(event.target.responseText)
    var attachments = this.state.addedAttachments;
    attachments.push(response);
    this.setState({addedAttachments: attachments})
  },

  updateDraft: function(event) {
    var kwargs = shortcuts.getURIArgs();
    console.log('updateDraft', kwargs)
    localStorage.setItem(
      this.getDraftId(
        kwargs.team_slug,
        kwargs.discussion_id),
      event.target.value
    )
    this.setState({draft: this.refs.comment.getRawValue()})
  },

  render: function() {
    console.log('render form', this.props, this.state)
    if (this.state.team) {
      return (

        <div className="message-reply content-view">
            <div>
              <iframe id="uploadFileIframe" name="uploadFileIframe"><html><body></body></html></iframe>
              <input type='file' onChange={this.handleFileInput}/>
              {this.state.addedAttachments.map(function (attachment, idx) {
                return <img src={"http://localhost:8000" + attachment.thumbnail}/>;
              })}
            </div>
          <form className="form-view" onSubmit={this.handleSubmit}>
            <div className="form-view-fields">
              <MarkdownView placeholder="Comment.."
                            submitLabel="Reply"
                            teamUrl={this.state.team.url}
                            ref="comment"
                            value={this.state.draft? this.state.draft : null}
                            onChange={this.updateDraft}
                            required />
            </div>
          </form>
        </div>
      );
    } else {
      return <div>Loading</div>;
    }
  }
});

module.exports = MessageReplyForm;
