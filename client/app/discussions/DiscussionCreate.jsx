'use strict';

var Backbone = require('backbone');
var React = require('react');
var store = require('../store');
var urls = require('../urls');
var MarkdownView = require('../components/MarkdownTextarea.jsx');

var DiscussionCreateView = React.createClass({

  handleSubmit: function(evt) {
    var title = this.refs.title.getDOMNode().value;
    store.add('discussions', {
      'title': title,
      'message': {
        'raw_body': this.refs.comment.getRawValue(),
        'user': localStorage.getItem('user')
      },
      'team': this.props.teamUrl
    }).done(function(response) {
      var team = store.find('teams', response.team);
      var url = urls.get('discussion:detail', {
        'team_slug': team.slug,
        'discussion_id': response.id,
        'slug': response.slug
      });
      Backbone.history.navigate(url, {'trigger': true});
    });
    return false;
  },

  render: function () {
    var titleField = React.DOM.input({
      'type': 'text',
      'placeholder': 'What are we talking about?',
      'ref': 'title',
      'required': true
    });
    return (
        <form className="form-view" onSubmit={this.handleSubmit}>
          <div className="form-view-fields">
            <MarkdownView placeholder="Comment.."
                          pre={titleField}
                          submitLabel="Create"
                          teamUrl={this.props.teamUrl}
                          ref="comment"
                          required />
          </div>
        </form>
    );
  }
});

module.exports = DiscussionCreateView;
