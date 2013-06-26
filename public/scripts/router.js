define(function (require) {
    "use strict";
    var Backbone = require('backbone'),
        gingerApp = require('core/app'),
        AuthRouter = require('apps/auth/router'),
        TeamRouter = require('apps/teams/router'),
        DiscussionRouter = require('apps/discussions/router'),
        authUtils = require('apps/auth/utils');


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
