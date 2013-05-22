define(['backbone',
        'core/app',
        'apps/auth/views/sign-in'], function (Backbone,
                                             gingerApp,
                                             SignInView) {
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
            console.log('AuthRouter:signIn');
            var view = new SignInView();
            gingerApp.mainRegion.show(view);
        },

        signOut: function () {
            console.log('AuthRouter:signOut');
        }
    });

    return AuthRouter;
});
