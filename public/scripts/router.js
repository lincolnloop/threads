define(['backbone',
        'apps/auth/router',
        'apps/teams/router',
        'apps/discussions/router'], function (Backbone,
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
