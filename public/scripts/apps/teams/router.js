define(['backbone', 'core/app', 'apps/teams/views/list',
        'apps/teams/views/detail'], function (Backbone, gingerApp,
                                            TeamListView, TeamDetailView) {
    "use strict";

    var TeamRouter = Backbone.Router.extend({

        routes: {
            "": 'index',
            "team/:team": 'detail'
        },

        initialize: function () {
            console.log('TeamRouter:initialize');
        },

        index: function () {
            console.log('TeamRouter:index');
            gingerApp.mainRegion.show(new TeamListView());
        },

        detail: function () {
            console.log('TeamRouter:detail');
        }
    });

    return TeamRouter;
});
