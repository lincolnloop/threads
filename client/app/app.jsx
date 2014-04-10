'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var router = require('./router');
var urls = require('./urls');
var store = require('./store');
var log = require('loglevel');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');

// --------------------
// Views
// --------------------
// common
var Nav = require('./components/nav');

// auth
var SignInView = require('./auth/sign-in');

// team views
var OrganizationList = require('./teams/organization-list');
var TeamDetailView = require('./teams/detail');
var teamUtils = require('./teams/utils');

// discussion views
var DiscussionDetailView = require('./discussions/detail');
var DiscussionCreateView = require('./discussions/create');


var AppView = React.createClass({

  render: function() {
    log.debug('AppView:render', this.state);
    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);
    var orgListView = '';

    if (organizations && organizations.length) {
      orgListView = (
        <OrganizationList organizations={organizations} />
      );
    }

    return (
      <div className="main">
        <nav id="top-nav">{this.state.topNav}</nav>
        <nav id="sidebar">{orgListView}</nav>
        <div id="content">
          {this.state.content}
        </div>
      </div>
    );
  },

  toggleTeamNav: function() {
    // todo: handle this through this.setState
    $('body').toggleClass('show-nav');
  },

  startSuccess: function() {
    // start history
    Backbone.history.start({pushState: true});
  },

  startFailed: function() {
    log.error('startFailed');
    // Initial data fetch failed.
    // For now, we just assume sign in error.
    // redirect to sign-in page
    // TODO: Handle querystring
    this.signIn();
  },

  getInitialState: function() {
    return {
      'topNav': Nav({
        'toggleTeamNav': this.toggleTeamNav
      }),
      'content': '',
      // TODO: Collection and User instances should not
      // be stored in state.
      'user': {},
      'teams': []
    };
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
  },

  componentDidMount: function() {
    // fetch initial data
    // TODO: enable event triggering on store object
    window.addEventListener('store:fetchSuccess', this.startSuccess);
    window.addEventListener('store:fetchFailed', this.startFailed);
    store.fetch();
  },

  // pages
  index: function() {
    log.debug('main:index');
    this.setState({
      'content': React.DOM.div()
    });
  },

  signIn: function() {
    // content > sign in view
    this.setState({
      'content': SignInView({
        'success': store.fetch.bind(store)
      }),
      'topNav': Nav({
        'title': 'Sign In'
      })
    });
  },

  signOut: function() {
    log.debug('main:signOut');
  },

  teamDetail: function(teamSlug) {
    log.debug('team:detail');
    var team = store.find('teams', {slug: teamSlug});
    // content > team discussion list view
    // TODO: We need to bootstrap teams on load
    var content = CSSTransitionGroup({
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
    log.debug('DiscussionRouter:create');
    var team = store.find('teams', {slug: teamSlug});
    // content > create view
    var content = CSSTransitionGroup({
      'transitionName': 'content',
      'component': React.DOM.div,
      'children': DiscussionCreateView({
        'team': team.url,
        'key': 'create-' + team.slug
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
  },

  discussionDetail: function(teamSlug, discussionId) {
    log.debug('discussion:detail');
    var team = store.find('teams', {slug: teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    // content > discussion detail view
    var content = CSSTransitionGroup({
      'transitionName': 'content',
      'component': React.DOM.div,
      'children': DiscussionDetailView({
        'team': team,
        'discussion': discussionUrl,
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
