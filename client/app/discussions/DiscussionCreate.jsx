'use strict';

var Backbone = require('backbone');
var React = require('react');
var store = require('../store');
var urls = require('../urls');
var MarkdownView = require('../components/MarkdownTextarea.jsx');
var Header = require('../components/Header.jsx');

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
    var back = urls.get('team:detail', {'slug': this.props.team.slug});
    return (
      <div className="discussion-create">
        <Header title={this.props.team.name} back={back} />
        <form className="content form-view" onSubmit={this.handleSubmit}>
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
