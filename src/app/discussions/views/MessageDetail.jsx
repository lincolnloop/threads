"use strict";

var _ = require('underscore');
var React = require('react');
var VotesView = require('./Votes.jsx');
var MessageEditView = require('./MessageEdit.jsx');
var MessageContentView = require('./MessageContent.jsx');

require('react/addons');

module.exports = React.createClass({
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
        <MessageView data={this.props.message} discussion={this.props.discussion} done={doneEditing} />
        {this.props.message.canEdit ? <a onClick={this.edit}>edit</a> : ''}
        <img src={this.props.message.user.gravatar} />{' '}
        {this.props.message.user.name}<br />
        {this.props.message.date_created}<br />
        <a onClick={this.reply}>reply</a>
        <VotesView data={this.props.message.votes} messageUrl={this.props.message.url} discussion={this.props.discussion} />
        <hr />
        {this.state.replying ? <MessageEditView parent={this.props.message.url} discussion={this.props.discussion} done={doneReplying} /> : ''}
      </div>
    );
  }
});