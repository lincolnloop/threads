"use strict";

var _ = require('underscore');
var React = require('react');
var VotesView = require('./Votes');
var MessageEditView = require('./MessageEdit');
var MessageContentView = require('./MessageContent');

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
    var MessageView = this.state.editing && !this.previewing ? MessageEditView : MessageContentView,
      doneEditing = _.partial(this.done, 'editing'),
      doneReplying = _.partial(this.done, 'replying'),
      classes = React.addons.classSet({
        'message-detail': true,
        'message-unread': !this.props.message.read,
        'message-collapsed': this.props.message.collapsed
      });
    return (
      <div className={classes}>
        <div className="avatar">
          <img src={this.props.message.user.gravatar} />
        </div>
        <div className="username">{this.props.message.user.name}</div>
        <div className="date">
          {this.props.message.date_created}
        </div>
        {MessageView({
          data: this.props.message,
          discussion: this.props.discussion,
          done: doneEditing
        })}
        {this.props.message.canEdit ? <a onClick={this.edit}>edit</a> : ''}
        {VotesView({
          data: this.props.message.votes,
          messageUrl: this.props.message.url,
          discussion: this.props.discussion
        })}
        <a onClick={this.reply}>reply</a>
        {this.state.replying ? <MessageEditView parent={this.props.message.url} discussion={this.props.discussion} done={doneReplying} /> : ''}
      </div>
    );
  }
});

module.exports = MessageDetail;
