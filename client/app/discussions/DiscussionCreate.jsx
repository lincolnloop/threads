'use strict';

var React = require('react');
var Backbone = require('Backbone');
var MarkdownView = require('../components/MarkdownTextarea.jsx');
var store = require('../store');
var urls = require('../urls');

var DiscussionCreateView = React.createClass({

  handleSubmit: function (evt) {
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
      Backbone.history.navigate(url, {'trigger': true});
    });
    return false;
  },

  render: function () {
    /*
    TODO: Footer
    var bottomNav = React.DOM.nav({'id': 'bottom-nav'},
      React.DOM.a({
        'href': '/',
        'children': 'Dashboard'
      })
    );
*/
    var back = urls.get('team:detail', {'slug': teamSlug});
    return (
      <div>
        <Header title={team.name} back={back} />
        <form className="discussion-create form-view" onSubmit={this.handleSubmit}>
          <div className="form-view-actions">
            <a href={back} className="btn btn-cancel ">Cancel</a>
            <button type="button" className="btn btn-preview">Preview</button>
            <button type="submit" className="btn btn-submit">Create</button>
          </div>
          <div className="form-view-fields">
            <input type="text" placeholder="What are we talking about?" ref="title" required />
            <MarkdownView placeholder="Comment.." ref="comment" required />
          </div>
        </form>
      </div>
    );
  }
});

module.exports = DiscussionCreateView;
