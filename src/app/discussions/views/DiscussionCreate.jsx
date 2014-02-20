"use strict";

var React = require('react');
var Discussion = require('../models/Discussion.js');
var MarkdownText = require('./../../components/MarkdownText');
var router = require('../../router');

module.exports = React.createClass({
  render: function () {
    return (
      <form className="discussion-create" onSubmit={this.submit}>
        <h2>New Discussion</h2>
        <input type="text" placeholder="What are we talking about?" ref="title" required />
        <MarkdownText placeholder="Comment.." ref="comment" required />
        <input type="submit" />
      </form>
    );
  },
  submit: function (evt) {
    var title = this.refs.title.getDOMNode().value;
    var discussion = new Discussion({
      title: title,
      message: {
        'raw_body': this.refs.comment.getRawValue()
      },
      team: this.props.team
    });
    evt.preventDefault();
    // save the newly created discussion instance
    // and redirect on success
    discussion.save({}, {
      success: function (discussion) {
        // get discussion list from local storage
        var discussions = window.app.data.teams.get(this.props.team).discussions;
        // add discussion to local storage
        discussions.add(discussion);
        // redirect to discussion detail page
        router.navigate(discussion.get('message').permalink,
          {'trigger': true});
      }.bind(this)
    });
  }
});
