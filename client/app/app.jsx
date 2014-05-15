'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Q = require('q');
var React = require('react');
var classSet = require('react/lib/cx');
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
var messageRoutes = require('./messages/routes');

var AppView = React.createClass({

  'signIn': function() {
    // signIn route
    // Note: this is stored here and not in auth/routes
    // for convenience purposes.
    log.info('auth:signIn');
    var deferred = Q.defer();
    // content > sign in view
    var contentView = SignInView({
      'success': _.partial(store.fetch.bind(store), this.startSuccess, this.startFailed)
    });
    var navView = TopNav({
      'title': 'Sign In'
    });

    deferred.resolve({
      'content': contentView,
      'topNav': navView,
      'navLevel': 0
    });

    return deferred.promise;
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
    this.route(this.signIn)();
  },

  route: function(view) {
    log.info('app.route');

    return _.partial(function() {
      // Setup a partial as a callback that 
      // receives the view function as it's first argument

      // set loading state ON
      this.setState({'loading': true});

      // The first argument on *arguments* is always the view
      // so extract it from the *arguments* list
      // and invoke the view with the remaining arguments
      // that come from the url router (e.g. teamSlug, discussionId, etc...)
      var view = Array.prototype.shift.apply(arguments);

      // call the view with the arguments, and then, refresh
      view.apply(null, arguments).then(this.refresh);

    }.bind(this), view);
  },

  refresh: function(options) {
    log.debug('app.refresh', options);
    //
    // Page transition helper method.
    // Determines which animation should ocurr for page changes
    // and triggers setState to re-render the UI
    //
    var transition = options.navLevel > this.state.navLevel ? 'right-to-left' : 'left-to-right';
    var content = CSSTransitionGroup({
      'transitionName': transition,
      'component': React.DOM.div,
      'children': options.content
    });
    // update state of our content and nav views
    // and also store the current navLevel.
    log.debug('app.refresh:navLevel', this.state.navLevel, options.navLevel);
    this.setState({
      'content': content,
      'topNav': options.topNav,
      'bottomNav': options.bottomNav ? options.bottomNav : function(){},
      'navLevel': options.navLevel,
      'loading': false
    });
  },

  getInitialState: function() {
    return {
      'topNav': '',
      'bottomNav': '',
      'content': '',
      'navLevel': 0,
      'user': {},
      'teams': [],
      'loading': true
    };
  },

  componentWillMount: function() {
    log.info('app.jsx:componentWillMount');
    //
    // Route view binding
    //
    router.on('route:index', this.route(teamRoutes.list));
    //router.on('route:index', this.route(teamRoutes.list));
    router.on('route:signIn', this.route(this.signIn));
    router.on('route:signOut', this.route(authRoutes.signOut));
    router.on('route:team:detail', this.route(teamRoutes.detail));
    router.on('route:team:create', this.route(discussionRoutes.create));
    router.on('route:discussion:detail', this.route(discussionRoutes.detail));
    router.on('route:message:edit', this.route(messageRoutes.edit));
    router.on('route:message:reply', this.route(messageRoutes.reply));
  },

  render: function() {
    var classes = classSet({
      'main': true,
      'loading': this.state.loading
    });
    return (
      <div className={classes}>
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
