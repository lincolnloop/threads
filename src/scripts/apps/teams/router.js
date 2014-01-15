"use strict";

var React = require('react'),
    Backbone = require('backbone'),
    TeamListView = require('./views/list.jsx'),
    TeamDetailView = require('./views/detail.jsx'),
    NavView = require('./views/nav.jsx');

var TeamRouter = Backbone.Router.extend({

    routes: {
        "": 'index',
        ":team/": 'detail'
    },

    initialize: function () {
        console.log('TeamRouter:initialize');
    },

    index: function () {
        console.log('TeamRouter:index');
        React.renderComponent(TeamListView({teams: window.app.data.teams}),
                              window.app.mainEl);
        React.renderComponent(NavView({
            title: 'Home/Unread messages'
        }), window.app.navMainEl);
    },

    detail: function (slug) {
        console.log('TeamRouter:detail');
        var team = window.app.data.teams.findWhere({slug: slug});
        React.renderComponent(TeamDetailView({
            team: team
        }), window.app.mainEl);
        React.renderComponent(NavView({
            title: team.get('name'),
            team: team
        }), window.app.navMainEl);
    }
});

module.exports = TeamRouter;
