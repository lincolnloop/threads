"use strict";

var Backbone = require('backbone'),
    React = require('react'),
    authUtils = require('./apps/auth/utils'),
    AuthRouter = require('./apps/auth/router'),
    DiscussionRouter = require('./apps/discussions/router'),
    layoutManager = require('./core/layoutManager'),
    NavView = require('./core/views/nav.jsx'),
    TeamRouter = require('./apps/teams/router'),
    TeamListView = require('./apps/teams/views/list.jsx');


var AppRouter = Backbone.Router.extend({
    routes: {
        "": 'index'
    },
    initialize: function () {
        console.log('AppRouter:initialize');
        new AuthRouter();
        new TeamRouter();
        new DiscussionRouter();
        this.setUp();
    },
    setUp: function () {
        // setUp Team nav, since it exists on all pages
        layoutManager.renderComponent(TeamListView({
            teams: window.app.data.teams
        }), 'navTeams');
    },
    index: function () {
        console.log('AppRouter:index');
        // Show the default landing page so we don't have to
        // wait for initial data to have something up
        layoutManager.renderComponent(NavView({
            title: 'Home/Unread messages'
        }), 'navMain');
        // TODO: Load home/dashboard
        $('#content-main').html('TODO:Load something here')
    }
});

module.exports = AppRouter;
