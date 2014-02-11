'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var router = require('../router');
var urls = require('../urls');
// --------------------
// Models
// --------------------
var Discussion = require('./discussions/models/discussion');
// --------------------
// Views
// --------------------
// common
var Nav = require('../core/views/Nav.jsx');
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
    // initial sidebar and content
    // regardless of route. 
    // (this never renders? router is fast enough to do the state change?)
    return {
      'sidebar': OrganizationList({
        'teams': window.app.data.teams,
        'toggleTeamNav': this.toggleTeamNav
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
    return (
      <div className="main">
        <div className="row">
          <nav id="nav-main" className="large-12 columns">
            {this.state.topNav}
          </nav>
        </div>
        <div className="row">
          <nav id="nav-teams" className="large-12 columns">
            {this.state.sidebar}
          </nav>
        </div>
        <div className="row">
          <div id="content-main" className="large-12 columns">
            {this.state.content}
          </div>
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
    var team = window.app.data.teams.findWhere({slug: slug});
    // content > team discussion list view
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': TeamDetailView({
        'team': team
      }),
      'topNav': Nav({
        'title': team.get('name'),
        'toggleTeamNav': this.toggleTeamNav,
        'team': team
      })
    });
  },
  discussionCreate: function (teamSlug) {
    console.log('DiscussionRouter:create');
    var team = window.app.data.teams.findWhere({slug: teamSlug});
    // content > create view
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': DiscussionCreateView({
        'discussion': new Discussion({team: team.id})
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
    var team = window.app.data.teams.findWhere({slug: teamSlug});
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