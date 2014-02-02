"use strict";

var Backbone = require('backbone'),
    AuthRouter = require('./apps/auth/router'),
    DiscussionRouter = require('./apps/discussions/router'),
    layoutManager = require('./core/layoutManager'),
    NavView = require('./core/views/nav.jsx'),
    TeamRouter = require('./apps/teams/router'),
    TeamListView = require('./apps/teams/views/list.jsx');

var AppRouter = Backbone.Router.extend({
    /*
     * Main App Router
     * Handles index and static/core routes only.
     * All other routes are delegated to apps/<app-name>/router.js
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
        /*
         * Render Teams Nav (persistent across all pages)
         */
        layoutManager.renderComponent(TeamListView({
            teams: window.app.data.teams
        }), 'navTeams');
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
        $('#content-main').html('TODO:Load something here')
    }
});

module.exports = AppRouter;
