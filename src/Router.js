"use strict";

var _ = require('underscore'),
  Backbone = require('backbone'),
  authUtils = require('./app/auth/utils'),
  AuthRouter = require('./app/auth/Router'),
  TeamRouter = require('./app/teams/Router'),
  DiscussionRouter = require('./app/discussions/Router'),
    layoutManager = require('./core/layoutManager'),
  SignInView = require('./app/auth/views/SignIn.jsx'),
  NavView = require('./core/views/Nav.jsx'),
  OrganizationList = require('./app/teams/views/OrganizationList.jsx');

var AppRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles index and static/core routes only.
   * All other routes are delegated to app/<app-name>/router.js
  */
  routes: {
    "": 'index'
  },
  initialize: function () {
    console.log('AppRouter:initialize');
    // sign-*/
    new AuthRouter();
    // <team-name>/
    new TeamRouter();
    // discussion/*
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
    /*
     * Index/Latest activty page.
     * Loads right away without waiting for data to be ready
     */
     // nav
    layoutManager.renderComponent(NavView({
        title: 'Activity'
    }), 'navMain');
    // main content TODO:Reactify
    document.getElementById('content-main').innerHTML = 'TODO:Load something here!';
  }
});

module.exports = AppRouter;
