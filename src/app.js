"use strict";

var _ = require('underscore'),
    $ = require('jquery'),
    async = require('async'),
    React = require('react'),
    Backbone = require('backbone'),
    AppRouter = require('./router'),
    config = require('clientconfig'),
    urls = require('./urls'),
    SignInView = require('./apps/auth/views/sign-in.jsx'),
    NavView = require('./core/views/nav.jsx'),
    authUtils = require('./apps/auth/utils'),
    User = require('./apps/auth/models/user'),
    UserCollection = require('./apps/auth/collections/user'),
    layoutManager = require('./core/layoutManager'),
    TeamCollection = require('./apps/teams/collections/team');

require('./core/globalEvents');

var app = _.extend({
    // default config can be overridden/extended by config passed in by cookie
    config: _.extend({
            apiUrl: 'https://gingerhq.com'
        }, config),
    data: {},
    fetchData: function () {
        var self = this;
        /*
         * Fetch data in parallel for:
         * > Current user
         * > User's teams
         * > Users list of people who share the same teams as current user.
         * more info @ https://github.com/caolan/async#parallel
         */
        async.parallel([
            function (cb) {
                /*
                 * Fetch current user's id
                 */
                // TODO: more is needed here to plug in the tokens
                //       this just fetchs the request users ID
                var url = urls.get('api:refresh_tokens');
                $.ajax({
                    dataType: "json",
                    url: app.config.apiUrl + url,
                    headers: {
                        Authorization: 'Token ' + localStorage.apiKey
                    },
                    success: function (data) {
                        self.data.tokens = data;
                    },
                    complete: function (response) {
                        cb(response.status === 200 ? false : response.status);
                    }
                });
            },
            function (cb) {
                /*
                 * Team list for current user
                 */
                function statusCallback(model, response) {
                    return cb(response.status === 200 ? false : response.status);
                }
                self.data.teams.fetch({
                    success: statusCallback,
                    error: statusCallback
                });
            },
            function (cb) {
                /*
                 * User list for current user
                 */
                function statusCallback(model, response) {
                    return cb(response.status === 200 ? false : response.status);
                }
                self.data.users.fetch({
                    success: statusCallback,
                    error: statusCallback
                });
            }
        ], function (err, results) {
            if (err) {
                console.log('Error fetching data', err);
                if (err === 403) {
                    // TODO: missing!
                    app.forceSignIn();
                    return;
                }
            } else {
                // get the current user's data
                self.data.requestUser = self.data.users.get(self.data.tokens.url);
                // start/load the app
                self.start();
            }
        });
    },
    authenticate: function () {
        /*
         * Check if user is authenticated and
         * show sign-in View if not, otherwise
         * fetch the app data
         */
        if (!authUtils.isAuthenticated()) {
            // sign in form
            layoutManager.renderComponent(SignInView({
                success: _.bind(this.fetchData, this)
            }), 'contentMain');
            // sign in nav
            layoutManager.renderComponent(NavView({
                title: 'Sign In'
            }), 'navMain');
        } else {
            this.fetchData();
        }
    },
    bootstrap: function () {
        console.log('app:boostrap');
        // Bootstrap the layoutManager.
        // This needs to happen before any React View is rendered
        this.layoutManager = layoutManager.bootstrap();
        // setup global team and user collections
        this.data.teams = new TeamCollection();
        this.data.users = new UserCollection();
        this.data.anonUser = new User({
            email: 'nobody@gingerhq.com',
            name: 'Deleted User',
            online: false,
            typing: false
        });
        // attempt to authenticate
        // TODO: Maybe we should drop the token in favor
        // of asking the user to authenticate against gingerhq.com?
        this.authenticate();
    },
    start: function () {
        console.log('app:start');
        // initialize the routers
        app.router = new AppRouter();
        if (!Backbone.history.started) {
            Backbone.history.start({pushState: true});
        }
    }
}, Backbone.Events);

window.app = app;
app.bootstrap();

module.exports = app;
