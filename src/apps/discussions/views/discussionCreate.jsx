"use strict";

var React = require('react'),
  app = require('../../../app.js'),
  Discussion = require('../models/discussion.js'),
  MarkdownText = require('./../../../components/MarkdownText.jsx');

module.exports = React.createClass({
  render: function () {
    return (
      <form className="discussion-create" onSubmit={this.submit}>
        <h2>New Discussion</h2>
        <input type="text" placeholder="What are we talking about?" ref="title" required />
        <MarkdownText placeholder="Comment.." ref="message" required />
        <input type="submit" />
      </form>
    );
  },
  submit: function (evt) {
    var title = this.refs.title.getDOMNode().value,
      discussion = new Discussion({
        title: title,
        message: {
          raw_body: this.refs.message.getRawValue()
        },
        team: this.props.team.get('url')
      });
    evt.preventDefault();
    // save the newly creted discussion instance
    // and redirect on success
    discussion.save({}, {
      success: function (discusison) {
        var discussionList = this.props.team.discussions;
        // add the discussion to the list of discussions for the team
        discussionList.add(discussion);
        // navigate to the discussion detail url
        // TODO: ohrl.get('discussion:detail', discussion.get(id))
        window.app.router.navigate(discussion.get('message').permalink,
          {trigger: true});
      }.bind(this)
    });
  }
});