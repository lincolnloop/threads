define(['backbone',
        'jquery',
        'core/app',
        'apps/teams/views/list'], function (Backbone, $, gingerApp,
                                            TeamListView) {
    "use strict";

    var TeamRouter = Backbone.Router.extend({

        routes: {
            "": 'index',
            "/teams/:team": 'detail'
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
