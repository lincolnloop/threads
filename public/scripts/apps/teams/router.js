var React = require('react'),
    Backbone = require('backbone'),
    gingerApp = require('../../core/app'),
    TeamListView = require('./views/list.jsx'),
    TeamDetailView = require('./views/detail.jsx');

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
        React.renderComponent(TeamListView({teams: gingerApp.data.teams}),
                              document.getElementById('main'));
    },

    detail: function (slug) {
        console.log('TeamRouter:detail');
        var team = gingerApp.data.teams.findWhere({slug: slug});
        React.renderComponent(TeamDetailView({
            team: team
        }), document.getElementById('main'));
    }
});

module.exports = TeamRouter;
