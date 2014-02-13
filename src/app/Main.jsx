'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var router = require('./router');
var urls = require('./urls');
// --------------------
// Models
// --------------------
var Discussion = require('./discussions/models/discussion');
// --------------------
// Views
// --------------------
// common
var Nav = require('./core/views/Nav.jsx');
// auth
var SignInView = require('./auth/views/SignIn.jsx');
// team views
var OrganizationList = require('./teams/views/OrganizationList.jsx');
var TeamDetailView = require('./teams/views/TeamDetail.jsx');
// discussion views
var DiscussionDetailView = require('./discussions/views/DiscussionDetail.jsx');
var DiscussionCreateView = require('./discussions/views/DiscussionCreate.jsx');

var Main = React.createClass({
  toggleTeamNav: function () {
    // todo: handle this through this.setState
    $('body').toggleClass('show-nav');
  },
  getInitialState: function() {
    // Initial sidebar, topNav and content.
    // All should be component instances.
    return {
      'sidebar': OrganizationList({
        'teams': this.props.teams
      }),
      'topNav': Nav({
        'toggleTeamNav': this.toggleTeamNav
      }),
      'content': ''
    }
  },
  componentWillMount: function() {
    // --------------------
    // route view binding
    // --------------------
    router.on('route:index', this.index);
    router.on('route:signIn', this.signIn);
    router.on('route:signOut', this.signOut);
    router.on('route:team:detail', this.teamDetail);
    router.on('route:team:create', this.discussionCreate);
    router.on('route:discussion:detail', this.discussionDetail);
    // start history
    Backbone.history.start({pushState: true});
  },
  render: function() {
    console.log('MainRender', this.state.content);
    return (
      <div className="main">
        <nav id="top-nav">
          {this.state.topNav}
        </nav>
        <nav id="sidebar">
          {this.state.sidebar}
        </nav>
        <div id="content">
          {this.state.content}
        </div>
      </div>
    );
  },
  // pages
  index: function() {
    console.log('main:index');
  },
  signIn: function() {
    console.log('main:signIn');
    // content > sign in view
    this.setState({
      'content': SignInView({}),
      'topNav': Nav({
        'title': 'Sign In'
      })
    });
  },
  signOut: function() {
    console.log('main:signOut');
  },
  teamDetail: function(slug) {
    console.log('team:detail');
    var team = this.props.teams.findWhere({slug: slug});
    // content > team discussion list view
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': TeamDetailView({
        'team': team.serialized()
      }),
      'topNav': Nav({
        'title': team.get('name'),
        'toggleTeamNav': this.toggleTeamNav
      })
    });
  },
  discussionCreate: function (teamSlug) {
    console.log('DiscussionRouter:create');
    var team = this.props.teams.findWhere({slug: teamSlug});
    // content > create view
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': DiscussionCreateView({
        'team': team.get('url')
      }),
      'topNav': Nav({
        'title': team.get('name'),
        'toggleTeamNav': this.toggleTeamNav,
        'team': team
      })
    });
  },
  discussionDetail: function(teamSlug, discussionId) {
    console.log('discussion:detail');
    var team = this.props.teams.findWhere({slug: teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
          discussion_id: discussionId
        });
    var discussion = team.discussions.get(discussionUrl) || new Discussion({url: discussionUrl});
    // content > discussion detail view
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': DiscussionDetailView({
        'discussion': discussion
      }),
      'topNav': Nav({
        'title': team.get('name'),
        'toggleTeamNav': this.toggleTeamNav,
        'team': team
      })
    });
  }
});

module.exports = Main;