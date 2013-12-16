var Backbone = require('backbone'),
    gingerApp = require('../../core/app'),
    TeamListView = require('./views/list'),
    TeamDetailView = require('./views/detail');

var TeamRouter = Backbone.Router.extend({

    routes: {
        "": 'index',
        "team/:team": 'detail'
    },

    initialize: function () {
        console.log('TeamRouter:initialize');
        gingerApp.mainRegion.show(new TeamDetailView());
    },

    index: function () {
        console.log('TeamRouter:index');
        gingerApp.mainRegion.show(new TeamListView());
    },

    detail: function () {
        console.log('TeamRouter:detail');
    }
});

module.exports = TeamRouter;
