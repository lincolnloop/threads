define(['backbone',
        'webapp/apps/auth/router.js',
        'webapp/apps/teams/router.js',
        'webapp/apps/discussions/router.js'], function (Backbone,
                                                        AuthRouter,
                                                        TeamRouter,
                                                        DiscussionRouter) {
    "use strict";

    var AppRouter = Backbone.Router.extend({

        initialize: function () {
            console.log('AppRouter:initialize');

            new AuthRouter();
            new TeamRouter();
            new DiscussionRouter();

            Backbone.history.start({
                pushState: true
            });
        }
    });

    return AppRouter;

});
