define(['backbone',
        'jquery',
        'apps/auth/models/user'], function (Backbone, $, User) {
    "use strict";

    var AuthRouter = Backbone.Router.extend({

        routes: {
            "sign-in": 'signIn',
            "sign-out": 'signOut'
        },

        initialize: function () {
            console.log('AuthRouter:initialize');
        },

        signIn: function () {
            console.log('AuthRouter:list');
        },

        signOut: function () {
            console.log('AuthRouter:detail');
        }
    });

    return AuthRouter;
});
