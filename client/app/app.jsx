'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var RSVP = require('rsvp');
var router = require('./router');
var urls = require('./urls');
var fetch = require('./utils/fetch');
var log = require('loglevel');
var Events = require('./utils/mixins').Events;

// --------------------
// Models
// --------------------

var User = require('./auth/User');
var UserCollection = require('./auth/UserCollection');
var TeamCollection = require('./teams/TeamCollection');
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

  render: function() {
    log.debug('AppView:render', this.state);

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

  toggleTeamNav: function() {
    // todo: handle this through this.setState
    $('body').toggleClass('show-nav');
  },

  start: function() {
    // set new app state to re-render teams nav
    this.setState({
      // TODO: we should not need this
      'initialized': true,
      'authenticated': true,
      'teams': window.data.teams.serialized()
    });
    // start history
    // TODO: Temporary placement for Backbone.history.start
    // until we figure out how to bootstrap required initial data
    // (or avoid requiring initial data)
    Backbone.history.start({pushState: true});
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
    /*
     * Route view binding
     */
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
    this.refreshData();
  },

  refreshData: function() {
    /*
     * Refresh the data using RSVP.hash() to manage multiple promises
     */
    RSVP.hash({
      'userUri': fetch.userUri(),
      'teams': fetch.teams(),
      'users': fetch.users()
    }).then(function(results) {
      // TODO: store initial data in window (temporary)
      window.data = {
        'teams': results.teams,
        'users': results.users,
        'user': results.users.get(results.userUri),
        'anonUser': new User({
          'email': 'nobody@gingerhq.com',
          'name': 'Deleted User',
          'online': false,
          'typing': false
        })
      };
      // can't do state changes here, otherwise any app
      // errors are caught by the catch below
      this.events.trigger('start');
    }.bind(this)).catch(function(reason) {
      // For now, just assume this is a sign in error, so show the auth view
      this.setState({
        'initialized': true,
        'authenticated': false,
      });
    }.bind(this));
  },

  // pages
  index: function() {
    log.debug('main:index');
    this.render();
  },

  signIn: function() {
    log.debug('main:signIn');
    // content > sign in view
    this.setState({
      'content': SignInView({}),
      'topNav': Nav({
        'title': 'Sign In'
      })
    });
  },

  signOut: function() {
    log.debug('main:signOut');
  },

  teamDetail: function(slug) {
    log.debug('team:detail');
    var team = window.data.teams.findWhere({slug: slug});
    // content > team discussion list view
    // TODO: We need to bootstrap teams on load
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
    log.debug('DiscussionRouter:create');
    var team = window.data.teams.findWhere({slug: teamSlug});
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
    log.debug('discussion:detail');
    var team = window.data.teams.findWhere({slug: teamSlug});
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
