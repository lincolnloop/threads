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

var MessageReplyForm = React.createClass({
  mixins: [eventsMixin],

  getInitialState: function () {
    return {
      draft: false,
      team: shortcuts.getActiveTeam()
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
    if (this.state.team) {
      return (
        <div className="message-reply">
          <form className="form-view" onSubmit={this.handleSubmit}>
            <div className="form-view-fields">
            <MarkdownView placeholder="Comment.."
                          submitLabel="Reply"
                          teamUrl={this.state.team.url}
                          ref="comment"
                          value={this.state.draft ? this.state.draft : null}
                          onChange={this.updateDraft}
                          required />
            </div>
          </form>
        </div>
      );
    }
    return <div>Loading</div>;
  }
});

module.exports = MessageReplyForm;
