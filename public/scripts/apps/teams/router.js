define(['backbone',
        'jquery'], function (Backbone, $) {
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
        },

        detail: function () {
            console.log('TeamRouter:detail');
        }
    });

    return TeamRouter;
});
