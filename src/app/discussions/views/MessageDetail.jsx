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
         this.props.data.url === nextProps.data.url &&
         this.props.data.body === nextProps.data.body &&
         _.isEqual(this.props.data.votes, nextProps.data.votes));
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
        'message-unread': !this.props.data.read,
        'message-collapsed': this.props.data.collapsed
      });
    return (
      <div className={classes}>
        <MessageView data={this.props.data} discussion={this.props.discussion} done={doneEditing} />
        {this.props.data.canEdit ? <a onClick={this.edit}>edit</a> : ''}
        <img src={this.props.data.user.gravatar} />{' '}
        {this.props.data.user.name}<br />
        {this.props.data.date_created}<br />
        <a onClick={this.reply}>reply</a>
        <VotesView data={this.props.data.votes} messageUrl={this.props.data.url} discussion={this.props.discussion} />
        <hr />
        {this.state.replying ? <MessageEditView parent={this.props.data.url} discussion={this.props.discussion} done={doneReplying} /> : ''}
      </div>
    );
  }
});