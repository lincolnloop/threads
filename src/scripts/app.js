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
        async.parallel([
            function (cb) {
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
                function statusCallback(model, response) {
                    return cb(response.status === 200 ? false : response.status);
                }
                self.data.teams.fetch({
                    success: statusCallback,
                    error: statusCallback
                });
            },
            function (cb) {
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
                    app.forceSignIn();
                    return;
                }
            } else {
                self.data.requestUser = self.data.users.get(self.data.tokens.url);
                self.start();
            }
        });
    },
    authenticate: function () {
        if (!authUtils.isAuthenticated()) {
            layoutManager.renderComponent(SignInView({
                success: _.bind(this.fetchData, this)
            }), 'contentMain');
            layoutManager.renderComponent(NavView({
                title: 'Sign In'
            }), 'navMain');
        } else {
            this.fetchData();
        }
    },
    bootstrap: function () {
        console.log('app:boostrap');
        // layoutManager
        this.layoutManager = layoutManager.bootstrap();
        // initial data 
        this.data.teams = new TeamCollection();
        this.data.users = new UserCollection();
        this.data.anonUser = new User({
            email: 'nobody@gingerhq.com',
            name: 'Deleted User',
            online: false,
            typing: false
        });
        // authenticate
        this.authenticate();
    },
    start: function () {
        console.log('app:start');
        // routing
        app.router = new AppRouter();
        if (!Backbone.history.started) {
            Backbone.history.start({pushState: true});
        }
    }
}, Backbone.Events);

window.app = app;
app.bootstrap();

module.exports = app;
