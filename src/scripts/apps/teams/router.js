"use strict";

var Backbone = require('backbone'),
    TeamDetailView = require('./views/detail.jsx'),
    layoutManager = require('../../core/layoutManager'),
    NavView = require('../../core/views/nav.jsx');

var TeamRouter = Backbone.Router.extend({
    routes: {
        ":team/": 'detail'
    },
    detail: function (slug) {
        var team = window.app.data.teams.findWhere({slug: slug});
        console.log('TeamRouter:detail');
        layoutManager.renderComponent(TeamDetailView({
            team: team
        }), 'contentTeam');
        layoutManager.renderComponent(NavView({
            title: team.get('name'),
            team: team
        }), 'navMain');
    }
});

module.exports = TeamRouter;
