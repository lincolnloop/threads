define(['backbone',
        'jquery',
        'apps/teams/collections/team',
        'apps/teams/views/list'], function (Backbone, $,
                                            TeamCollection,
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
            var teamCollection = new TeamCollection();
            teamCollection.fetch({
                // FIXME
                headers: { Authorization: 'Token ' + localStorage.Authorization },
                success: function (collection) {
                    new TeamListView({
                        el: $('body'),
                        collection: collection
                    }).render();
                }
            })
        },

        detail: function () {
            console.log('TeamRouter:detail');
        }
    });

    return TeamRouter;
});
