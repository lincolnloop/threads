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

var MessageReplyForm = React.createClass({
  mixins: [eventsMixin],

  getInitialState: function () {
    return {draft: false};
  },

  componentDidMount: function () {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    var team = store.find('teams', {'slug': kwargs.team_slug});
    this.setState({
      team: team,
    });
    var draft = localStorage.getItem(this.getDraftId());
    if (draft) {
      this.setState({
        draft: draft,
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
    store.add('messages', data).then(function(message) {
      log.info('MessageReply:success');

      localStorage.removeItem(this.getDraftId());

      if (this.props.callback) {
        this.emitter.emit('message:add');
        this.props.callback();
      } else {
        // redirect to discussion detail
        var kwargs = urls.resolve(window.location.pathname).kwargs;
        var url = urls.get('discussion:detail:message', _.extend(kwargs, {'message_id': message.id}));
        app.history.navigate(url, {'trigger': true});
      }
    }.bind(this));
  },

  getDraftId: function () {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    return 'draft-' + kwargs.team_slug + '-' + kwargs.discussion_id;
  },

  updateDraft: function(event) {
    var kwargs = urls.resolve(window.location.pathname).kwargs;
    console.log('updateDraft', kwargs)
    localStorage.setItem(
      this.getDraftId(
        kwargs.team_slug,
        kwargs.discussion_id),
      event.target.value
    )
    this.setState({draft: event.target.value})
  },

  render: function() {

    if (this.state.team) {

    return (
      <div className="message-reply content-view">
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
  }
  return <div>Loading</div>;
}
});

module.exports = MessageReplyForm;
