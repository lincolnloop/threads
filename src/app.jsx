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
var Nav = require('./core/views/Nav');

// auth
var SignInView = require('./auth/views/SignIn');

// team views
var OrganizationList = require('./teams/views/OrganizationList');
var TeamDetailView = require('./teams/views/TeamDetail');

// discussion views
var DiscussionDetailView = require('./discussions/views/DiscussionDetail');
var DiscussionCreateView = require('./discussions/views/DiscussionCreate');


var AppView = React.createClass({

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
    var content = React.addons.TransitionGroup({
      transitionName: 'content',
      component: React.DOM.div,
      children: TeamDetailView({
        'team': team.serialized(),
        'key': team.get('slug')
      })
    });
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content':  content,
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
    var content = React.addons.TransitionGroup({
      transitionName: 'content',
      component: React.DOM.div,
      children: DiscussionCreateView({
        'team': team.get('url'),
        'key': 'create-' + team.get('slug')
      })
    });
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': content,
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
    // content > discussion detail view
    var content = React.addons.TransitionGroup({
      transitionName: 'content',
      component: React.DOM.div,
      children: DiscussionDetailView({
        'team': team.serialized(),
        'discussionUrl': discussionUrl,
        'key': 'discussion-detail' + discussionUrl
      })
    });
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': content,
      'topNav': Nav({
        'title': team.get('name'),
        'toggleTeamNav': this.toggleTeamNav,
        'team': team
      })
    });
  }

});

module.exports = AppView;
