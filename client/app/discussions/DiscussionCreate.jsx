'use strict';

var React = require('react');
var MarkdownView = require('../components/MarkdownTextarea.jsx');
var router = require('../router');
var store = require('../store');
var urls = require('../urls');

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
    }).then(function(response) {
      var team = store.find('teams', response.team);
      var url = urls.get('discussion:detail', {
        'team_slug': team.slug,
        'discussion_id': response.id,
        'slug': response.slug
      });
      router.navigate(url, {'trigger': true});
    });
    return false;
  }

});

module.exports = DiscussionCreateView;
