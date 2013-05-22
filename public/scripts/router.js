define(['backbone',
        'core/app',
        'apps/auth/router',
        'apps/teams/router',
        'apps/discussions/router',
        'apps/auth/utils'], function (Backbone,
                                              gingerApp,
                                              AuthRouter,
                                              TeamRouter,
                                              DiscussionRouter,
                                              authUtils) {
    "use strict";

    var AppRouter = Backbone.Router.extend({

        initialize: function () {
            console.log('AppRouter:initialize');

            new AuthRouter();
            new TeamRouter();
            new DiscussionRouter();

            Backbone.on('route', function () {
                if (!authUtils.isAuthenticated()) {
                    this.navigate('sign-in', {trigger: true});
                }
            });

            Backbone.history.start({
                pushState: true
            });

        }
    });

    return AppRouter;

});
