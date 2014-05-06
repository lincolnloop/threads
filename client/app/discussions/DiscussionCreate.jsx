'use strict';

var React = require('react');
var MarkdownView = require('../components/MarkdownTextarea.jsx');
var router = require('../router');
var store = require('../store');
var urls = require('../urls');

var DiscussionCreateView = React.createClass({

  render: function () {
    return (
      <form className="discussion-create form-view" onSubmit={this.submit}>
        <div className="form-view-actions">
          <a href={this.props.cancelLink} className="btn btn-cancel ">Cancel</a>
          <button type="button" className="btn btn-preview">Preview</button>
          <button type="submit" className="btn btn-submit">Create</button>
        </div>
        <div className="form-view-fields">
          <input type="text" placeholder="What are we talking about?" ref="title" required />
          <MarkdownView placeholder="Comment.." ref="comment" required />
        </div>
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
