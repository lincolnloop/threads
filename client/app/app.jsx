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
var TopNav = require('./components/TopNav.jsx');

// auth
var SignInView = require('./auth/sign-in.jsx');

// team views
var OrganizationList = require('./teams/organization-list.jsx');
var TeamDetailView = require('./teams/detail.jsx');
var teamUtils = require('./teams/utils');

// discussion views
var DiscussionDetailView = require('./discussions/detail.jsx');
var DiscussionCreateView = require('./discussions/create.jsx');


var AppView = React.createClass({

  updateUI: function(options) {
    var transition = options.navLevel > this.state.navLevel ? 'right-to-left' : 'left-to-right';
    var content = CSSTransitionGroup({
      'transitionName': transition,
      'component': React.DOM.div,
      'children': options.content
    });

    this.setState({
      'content': content,
      'topNav': options.topNav,
      'navLevel': options.navLevel
    });
  },

  render: function() {
    log.debug('AppView:render', this.state);

    return (
      <div className="main">
        <nav id="top-nav">{this.state.topNav}</nav>
        <div id="content">
          {this.state.content}
        </div>
      </div>
    );
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
      'topNav': TopNav({
        'title': 'Threads'
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
    var teams = store.findAll('teams');
    var organizations = teamUtils.groupByOrganizations(teams);
    var contentView = '';

    if (organizations && organizations.length) {
      contentView = OrganizationList({
        organizations: organizations
      });
    }
    var navView = TopNav({
      'title': 'Threads'
    });

    this.updateUI({
      'content': contentView,
      'topNav': navView,
      'navLevel': 0
    });
  },

  signIn: function() {
    // content > sign in view
    var contentView = SignInView({
      'success': store.fetch.bind(store)
    });
    var navView = TopNav({
      'title': 'Sign In'
    });

    this.updateUI({
      'content': contentView,
      'topNav': navView,
      'navLevel': 0
    });
  },

  signOut: function() {
    log.debug('main:signOut');
  },

  teamDetail: function(teamSlug) {
    log.debug('team:detail');
    var navLevel = 1;
    var team = store.find('teams', {slug: teamSlug});
    // content > team discussion list view
    // TODO: We need to bootstrap teams on load
    var contentView = TeamDetailView({
      'team': team,
      'key': teamSlug
    });
    var navView = TopNav({
      'title': team.name
    });

    this.updateUI({
      'content': contentView,
      'topNav': navView,
      'navLevel': 5
    });
  },

  discussionCreate: function (teamSlug) {
    log.debug('DiscussionRouter:create');
    var team = store.find('teams', {slug: teamSlug});
    // content > create view
    var contentView = DiscussionCreateView({
      'team': team.url,
      'key': 'create-' + team.slug
    });
    var navView = TopNav({
      'title': team.name,
      'team': team
    });

    this.updateUI({
      'content': contentView,
      'topNav': navView,
      'navLevel': 10
    });
  },

  discussionDetail: function(teamSlug, discussionId) {
    log.debug('discussion:detail');
    var team = store.find('teams', {slug: teamSlug});
    var discussionUrl = urls.get('api:discussionChange', {
      'discussion_id': discussionId
    });
    // content > discussion detail view
    var contentView = DiscussionDetailView({
      'team': team,
      'discussion': discussionUrl,
      'key': 'discussion-detail' + discussionUrl
    });
    var navView = TopNav({
      'title': team.name,
      'team': team
    });

    this.updateUI({
      'content': contentView,
      'topNav': navView,
      'navLevel': 15
    });
  }
});

module.exports = AppView;
