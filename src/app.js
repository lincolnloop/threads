"use strict";

var _ = require('underscore'),
  $ = require('jquery'),
  async = require('async'),
  React = require('react'),
  Backbone = require('backbone'),
  AppRouter = require('./router'),
  config = require('clientconfig'),
  urls = require('./urls'),
  User = require('./apps/auth/models/user'),
  UserCollection = require('./apps/auth/collections/user'),
  TeamCollection = require('./apps/teams/collections/team');

require('./core/globalEvents');

var app = _.extend({
  // default config can be overridden/extended by config passed in by cookie
  config: _.extend({
    apiUrl: 'https://gingerhq.com'
  }, config),
  // app/global data
  data: {
    teams: new TeamCollection(),
    users: new UserCollection(),
    anonUser: new User({
      email: 'nobody@gingerhq.com',
      name: 'Deleted User',
      online: false,
      typing: false
    })
  },
  fetchData: function () {
    var self = this;
    /*
     * Fetch data in parallel for:
     * > Current user
     * > User's teams
     * > Users list of people who share the same teams as current user.
     * more info @ https://github.com/caolan/async#parallel
     *
     * This method is only called after the user is authenticated
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
    ], _.bind(this.fetchDataCallback, self));
  },
  fetchDataCallback: function (err, results) {
    if (err) {
      console.log('Error fetching data', err);
      if (err === 403) {
          // TODO: missing!
          app.forceSignIn();
          return;
      }
    } else {
      // get the current user's data
      this.data.requestUser = this.data.users.get(this.data.tokens.url);
      // start/load the app
      this.start();
    }
  },
  bootstrap: function () {
    // set this to window.app
    window.app = this;
    // initialize the routers
    app.router = new AppRouter();
  },
  start: function () {
    // start is only called after initial data is fetched
    console.log('app:start');
    if (!Backbone.history.started) {
      Backbone.history.start({pushState: true});
    }
  }
}, Backbone.Events);

app.bootstrap();

module.exports = app;
