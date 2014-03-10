'use strict';

var React = require('react');
var MarkdownView = require('../../messages/views/markdown');
var router = require('../../router');
var store = require('../../store');

var DiscussionCreateView = React.createClass({

  render: function () {
    return (
      <form className="discussion-create" onSubmit={this.submit}>
        <h2>New Discussion</h2>
        <input type="text" placeholder="What are we talking about?" ref="title" required />
        <MarkdownView placeholder="Comment.." ref="comment" required />
        <input type="submit" />
      </form>
    );
  },

  submit: function (evt) {
    var title = this.refs.title.getDOMNode().value;
    store.add('discussions', {
      'title': title,
      'message': {
        'raw_body': this.refs.comment.getRawValue(),
        'user': localStorage.getItem('user')
      },
      'team': this.props.team
    });
    return false;
    /*
    var discussion = new Discussion({
      
    });
    evt.preventDefault();
    // save the newly created discussion instance
    // and redirect on success
    discussion.save({}, {
      success: function (discussion) {
        // get discussion list from local storage
        var discussions = window.data.teams.get(this.props.team).discussions;
        // add discussion to local storage
        discussions.add(discussion);
        // redirect to discussion detail page
        router.navigate(discussion.get('message').permalink,
          {'trigger': true});
      }.bind(this)
    });
*/
  }

});

module.exports = DiscussionCreateView;
