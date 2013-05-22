define(['backbone',
        'core/app',
        'apps/auth/router',
        'apps/teams/router',
        'apps/discussions/router'], function (Backbone,
                                              gingerApp,
                                              AuthRouter,
                                              TeamRouter,
                                              DiscussionRouter) {
    "use strict";

    var AppRouter = Backbone.Router.extend({

        initialize: function () {
            console.log('AppRouter:initialize');
            gingerApp.addRegions({
                  navRegion: "#nav",
                  mainRegion: "#main",
            });

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
