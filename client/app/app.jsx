'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var React = require('react');
var store = require('./store');
var log = require('loglevel');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');

// --------------------
// Views
// --------------------
// common
var TopNav = require('./components/TopNav.jsx');

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
      'navLevel': options.navLevel
    });
  },

  startSuccess: function() {
    log.error('startSuccess');
    // start history
    Backbone.history.start({pushState: true});
  },

  startFailed: function(error) {
    log.error('startFailed');
    // Initial data fetch failed.
    // For now, we just assume sign in error.
    // redirect to sign-in page
    // TODO: Handle querystring
    this.updateUI(authRoutes.signIn);
  },

  getInitialState: function() {
    return {
      'topNav': '',
      'content': '',
      'navLevel': 0,
      'user': {},
      'teams': [],
    };
  },

  componentWillMount: function() {
    log.info('app.jsx:componentWillMount');
    var router = new Backbone.Router();
    //
    // Route view binding
    //

    // index
    router.route('', this.route(teamRoutes.list));
    // signIn
    router.route('sign-in/', this.route(authRoutes.signIn));
    // signOut
    router.route('sign-out/', this.route(authRoutes.signIn));
    // team detail
    router.route(':team/', this.route(teamRoutes.detail));
    // team discussion create
    router.route('discussion/create/:teamSlug/', this.route(discussionRoutes.create));
    // discussion detail
    router.route(':teamSlug/:discussionId/:discussionSlug/', this.route(discussionRoutes.detail));
  },

  render: function() {
    return (
      <div className="main">
        <nav id="top-nav">{this.state.topNav}</nav>
        <div id="content">
          {this.state.content}
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    // fetch initial data
    // TODO: enable event triggering on store object
    window.addEventListener('store:fetchSuccess', this.startSuccess);
    store.fetch(this.startSuccess, this.startFailed);
  }
});

module.exports = AppView;
