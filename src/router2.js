"use strict";

var _ = require('underscore');
var Backbone = require('backbone');
/*
var authUtils = require('./app/auth/utils');
var AuthRouter = require('./app/auth/Router');
var TeamRouter = require('./app/teams/Router');
var DiscussionRouter = require('./app/discussions/Router');
var layoutManager = require('./core/layoutManager');
var SignInView = require('./app/auth/views/SignIn.jsx');
var NavView = require('./core/views/Nav.jsx');
var OrganizationList = require('./app/teams/views/OrganizationList.jsx');
*/
var AppRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on app/Main.jsx instead.
  */
  routes: {
    "": 'index',
    "sign-in": 'signIn',
    "sign-out": 'signOut',
    ":team/": 'team:detail',
    "discussion/create/:teamSlug/": 'team:create',
    ":teamSlug/:discussionId/:discussionSlug/": 'discussion:detail'
  }/*,
  initialize: function () {
    console.log('AppRouter:initialize');
    new AuthRouter();
    // <team-name>/
    new TeamRouter();
    // <team-name>/<discussion-id>/*
    new DiscussionRouter();

    this.bootstrap();
  },
  bootstrap: function () {
    // Bootstrap the layoutManager.
    // This needs to happen before any React View is rendered
    this.layoutManager = layoutManager.bootstrap();
    // Render Teams Nav (persistent across all pages),
    // and rendered regradless user is authenticated
    layoutManager.renderComponent(OrganizationList({
      teams: window.app.data.teams
    }), 'navTeams');
    //
    // Check if user is authenticated and
    // show sign-in View if not, otherwise
    // fetch the app data
    //
    // attempt to authenticate
    // TODO: Maybe we should drop the token in favor
    // of asking the user to authenticate against gingerhq.com?
    if (!authUtils.isAuthenticated()) {
      // sign in form
      layoutManager.renderComponent(SignInView({
          success: _.bind(window.app.fetchData, window.app)
      }), 'contentMain');
      // sign in nav
      layoutManager.renderComponent(NavView({
          title: 'Sign In'
      }), 'navMain');
    } else {
      // if user is authenticated > fetch data
      window.app.fetchData();
    }
  },
  index: function () {
    //
    // Index/Latest activty page.
    // Loads right away without waiting for data to be ready
    //
    // nav
    layoutManager.renderComponent(NavView({
        title: 'Activity'
    }), 'navMain');
    // main content TODO:Reactify
    document.getElementById('content-main').innerHTML = 'TODO:Load something here!';
  }*/
});

module.exports = new AppRouter();
