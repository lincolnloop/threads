define(['backbone',
        'jquery',
        'scripts/apps/auth/models/user'], function (Backbone, $, User) {
    "use strict";

    var AuthRouter = Backbone.Router.extend({
        // $.ajax({url: 'https://gingerhq.com/api/v2/discussion/?team__slug=lincoln-loop&limit=5', headers: {'Authorization': localStorage.Authorization,'content-type': 'application/json'}})
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
