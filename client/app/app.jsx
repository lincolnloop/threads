'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var router = require('./router');
var urls = require('./urls');
var store = require('./store');
var Events = require('./utils/mixins').Events;

// --------------------
// Models
// --------------------
var Discussion = require('./discussions/models/discussion');

// --------------------
// Views
// --------------------
// common
var Nav = require('./nav');

// auth
var SignInView = require('./auth/views/SignIn');

// team views
var OrganizationList = require('./teams/views/OrganizationList');
var TeamDetailView = require('./teams/views/TeamDetail');

// discussion views
var DiscussionDetailView = require('./discussions/views/DiscussionDetail');
var DiscussionCreateView = require('./discussions/views/DiscussionCreate');


var AppView = React.createClass({
  mixins: [Events],

  toggleTeamNav: function() {
    // todo: handle this through this.setState
    $('body').toggleClass('show-nav');
  },

  startSucess: function() {
    // Initial data fetch success > refresh app
    this.setState({
      'initialized': true,
      'authenticated': true,
      'teams': store.get('teams')
    });
    // start history
    Backbone.history.start({pushState: true});
  },

  startFailed: function(reason) {
    // Initial data fetch failed.
    // For now, we just assume sign in error.
    this.setState({
      'initialized': true,
      'authenticated': false
    })
  },

  getInitialState: function() {
    return {
      'topNav': Nav({
        'toggleTeamNav': this.toggleTeamNav
      }),
      'content': '',
      'initialized': false,
      'authenticated': false,
      // TODO: Collection and User instances should not
      // be stored in state.
      'user': {},
      'teams': []
    }
  },

  componentWillMount: function() {
    //
    // Route view binding
    //
    router.on('route:index', this.index);
    router.on('route:signIn', this.signIn);
    router.on('route:signOut', this.signOut);
    router.on('route:team:detail', this.teamDetail);
    router.on('route:team:create', this.discussionCreate);
    router.on('route:discussion:detail', this.discussionDetail);

    // bind bootstrap event
    this.events.on('start', this.start);
  },

  componentDidMount: function() {
    // fetch initial data
    // TODO: enable event triggering on store object
    window.addEventListener('store:fetchSuccess', this.startSucess);
    window.addEventListener('store:fetchFailed', this.startFail);
    store.fetch();
  },

  render: function() {
    console.log('AppView:render', this.state);

    if (this.state.initialized && !this.state.authenticated) {
      // Show the SignIn view
      return (
        <SignInView success={this.refreshData} />
      );
    }

    var orgList = '';
    if (this.state.initialized) {
      orgList = (
        <OrganizationList organizations={this.state.teams} />
      );
    }

    return (
      <div className="main">
        <nav id="sidebar">{orgList}</nav>
        <div id="content">
          {this.state.content}
        </div>
      </div>
    );
  },

  // pages
  index: function() {
    console.log('main:index');
    this.render();
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

  teamDetail: function(teamSlug) {
    console.log('team:detail');
    var team = store.find('teams', {slug: teamSlug});
    // content > team discussion list view
    // TODO: We need to bootstrap teams on load
    var content = React.addons.TransitionGroup({
      'transitionName': 'content',
      'component': React.DOM.div,
      'children': TeamDetailView({
        'team': team,
        'key': teamSlug
      })
    });
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content':  content,
      'topNav': Nav({
        'title': team.name,
        'toggleTeamNav': this.toggleTeamNav
      })
    });
  },

  discussionCreate: function (teamSlug) {
    console.log('DiscussionRouter:create');
    var team = store.find('teams', {slug: teamSlug});
    // content > create view
    var content = React.addons.TransitionGroup({
      'transitionName': 'content',
      'component': React.DOM.div,
      'children': DiscussionCreateView({
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
    var team = store.find('teams', {'slug': teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    // content > discussion detail view
    var content = React.addons.TransitionGroup({
      'transitionName': 'content',
      'component': React.DOM.div,
      'children': DiscussionDetailView({
        'team': team,
        'discussionUrl': discussionUrl,
        'key': 'discussion-detail' + discussionUrl
      })
    });
    // TODO: Move topNav to it's own *catch all* route
    // to keep it DRY.
    this.setState({
      'content': content,
      'topNav': Nav({
        'title': team.name,
        'toggleTeamNav': this.toggleTeamNav,
        'team': team
      })
    });
  }
});

module.exports = AppView;
