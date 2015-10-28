'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var gravatar = require('../utils/gravatar');
var moment = require('moment');
var urls = require('../urls');
var store = require('../store');
var MarkdownView = require('../components/MarkdownTextarea.jsx');

var MessageReplyForm = React.createClass({


  getInitialState: function () {
    return {draft: false};
  },

  componentDidMount: function () {
    console.log('MRF:cdM', this.state, this.props)
    var draft = localStorage.getItem(this.getDraftId());
    console.log(this.getDraftId(), draft)
    if (draft) {
      console.log('setState')
      this.setState({draft: draft});
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


      var kwargs = urls.resolve(window.location.pathname).kwargs;
      console.log('removing draft', this.getDraftId())
      localStorage.removeItem(this.getDraftId());
      // redirect to discussion detail
      var url = urls.get('discussion:detail:message', _.extend(kwargs, {'message_id': message.id}));
      app.history.navigate(url, {'trigger': true});
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
    console.log('form render', this.state)
    var kwargs = urls.resolve(window.location.pathname).kwargs;

    //TODO
    var team = store.find('teams', {'slug': kwargs.team_slug});
    return (
      <div className="message-reply content-view">
        <form className="form-view" onSubmit={this.handleSubmit}>
          <div className="form-view-fields">
          <MarkdownView placeholder="Comment.."
                        submitLabel="Reply"
                        teamUrl={team.url}
                        ref="comment"
                        value={this.state.draft? this.state.draft : null}
                        onChange={this.updateDraft}
                        required />
          </div>
        </form>
      </div>
    );
  }
});

module.exports = MessageReplyForm;
