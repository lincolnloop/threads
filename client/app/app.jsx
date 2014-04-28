'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var store = require('./store');
var router = require('./router');
var log = require('loglevel');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');

// --------------------
// Views
// --------------------
// common
var TopNav = require('./components/TopNav.jsx');
var SignInView = require('./auth/SignIn.jsx');

// --------------------
// routes
// --------------------
var authRoutes = require('./auth/routes');
var teamRoutes = require('./teams/routes');
var discussionRoutes = require('./discussions/routes');

var AppView = React.createClass({
  
  route: function(view) {
    log.info('route');
    // shortcut for route callbacks
    return _.partial(this.updateUI, view);
  },

  updateUI: function() {
    log.info('updateUI');
    // NOTE: This is more complicated than it should be.
    // We should figure out a way to make it simpler, 
    // but still follow DRY principles.
    //
    // Page transition helper method.
    // Determines which animation should ocurr for page changes
    // and triggers setState to re-render the UI
    // - arguments > []
    //   - view
    //   - *route arguments

    // The first argument on *arguments* is always the view
    // so extract it from the *arguments* list
    // and invoke the view with the remaining arguments
    // that come from the url router (e.g. teamSlug, discussionId, etc...)
    var options = {};
    var view = Array.prototype.shift.apply(arguments);
    log.debug('app:updateUI', view, arguments);
    try {
      // each controller-view should return a list of React views
      // and the `navLevel` of the view as an object.
      options = view.apply(null, arguments);
    } catch(e) {
      log.error(e);
    }
    // Animation is calculated based on the current and next values of 
    // *navLevel* (`this.state.navLevel` and `options.navLevel` respectively)
    // If the next `navLevel` is higher than the current `navLevel`, 
    // it means we're going deeper into the navigation, so we need to simulate
    // a forward motion (new content comes from the right to the left).
    var transition = options.navLevel > this.state.navLevel ? 'right-to-left' : 'left-to-right';
    var content = CSSTransitionGroup({
      'transitionName': transition,
      'component': React.DOM.div,
      'children': options.content
    });
    // update state of our content and nav views
    // and also store the current navLevel.
    this.setState({
      'content': content,
      'topNav': options.topNav,
      'bottomNav': options.bottomNav ? options.bottomNav : function(){},
      'navLevel': options.navLevel
    });
  },

  'signIn': function() {
    // signIn route
    // Note: this is stored here and not in auth/routes
    // for convenience purposes.
    log.info('auth:signIn');
    // content > sign in view
    var contentView = SignInView({
      'success': _.partial(store.fetch.bind(store), this.startSuccess, this.startFailed)
    });
    var navView = TopNav({
      'title': 'Sign In'
    });

    return {
      'content': contentView,
      'topNav': navView,
      'navLevel': 0
    };
  },

  startSuccess: function() {
    log.info('startSuccess');
    // start history
    Backbone.history.start({pushState: true});
  },

  startFailed: function(error) {
    log.error('start:failed', error);
    // Initial data fetch failed.
    // For now, we just assume sign in error.
    // redirect to sign-in page
    // TODO: Handle querystring
    this.updateUI(this.signIn);
  },

  getInitialState: function() {
    return {
      'topNav': '',
      'bottomNav': '',
      'content': '',
      'navLevel': 0,
      'user': {},
      'teams': [],
    };
  },

  componentWillMount: function() {
    log.info('app.jsx:componentWillMount');
    //
    // Route view binding
    //
    router.on('route:index', this.route(teamRoutes.list));
    router.on('route:signIn', this.route(this.signIn));
    router.on('route:signOut', this.route(authRoutes.signOut));
    router.on('route:team:detail', this.route(teamRoutes.detail));
    router.on('route:team:create', this.route(discussionRoutes.create));
    router.on('route:discussion:detail', this.route(discussionRoutes.detail));
  },

  render: function() {
    return (
      <div className="main">
        <nav id="top-nav">{this.state.topNav}</nav>
        <div id="content">
          {this.state.content}
        </div>
        {this.state.bottomNav}
      </div>
    );
  },

  componentDidMount: function() {
    // fetch initial data
    store.fetch(this.startSuccess, this.startFailed);
  }
});

module.exports = AppView;
