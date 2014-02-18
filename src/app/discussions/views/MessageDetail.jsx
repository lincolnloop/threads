"use strict";

var _ = require('underscore');
var React = require('react');
var VotesView = require('./Votes.jsx');
var MessageEditView = require('./MessageEdit.jsx');
var MessageContentView = require('./MessageContent.jsx');
var MarkdownText = require('../../components/MarkdownText.jsx');

require('react/addons');

var MessageDetail = React.createClass({
  getInitialState: function () {
    return {
      editing: false,
      replying: false
    };
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    return !(_.isEqual(this.state, nextState) &&
         this.props.message.url === nextProps.message.url &&
         this.props.message.body === nextProps.message.body &&
         _.isEqual(this.props.message.votes, nextProps.message.votes));
  },
  edit: function (event) {
    this.setState({editing: true});
  },
  reply: function (event) {
    this.setState({replying: true});
  },
  done: function (input) {
    var state = {};
    state[input] = false;
    this.setState(state);
  },
  render: function () {
    console.log('MessageDetailView:render');
    var message = this.props.message;
    var user = message.user;
    var MessageView = this.state.editing && !this.previewing ? MessageEditView : MessageContentView;
    var doneEditing = _.partial(this.done, 'editing');
    var doneReplying = _.partial(this.done, 'replying');
    var classes = React.addons.classSet({
      'message-detail': true,
      'message-unread': !this.props.message.read,
      'message-collapsed': this.props.message.collapsed
    });
    return (
      React.DOM.div({className: classes},
        React.DOM.div({className: 'avatar'},
          React.DOM.img({src: user.gravatar})
        ),
        React.DOM.div({className: 'username', hildren: user.name}),
        React.DOM.div({className: 'date',children: message.date_created}),
        MarkdownText({value: message.raw_body, previewValue: message.body}),
        MessageView({
          data: message,
          discussion: this.props.discussion,
          done: doneEditing
        }),
        message.canEdit ? React.DOM.a({onClick: this.edit, children: 'edit'}) : '',
        VotesView({
          data: message.votes,
          messageUrl: message.url,
          discussion: this.props.discussion
        }),
        React.DOM.a({onClick: this.reply, children: 'reply'}),
        this.state.replying ? MessageEditView({parent: message.url, discussion: this.props.discussion, done: doneReplying}) : ''
      )
    );
  }
});

module.exports = MessageDetail;