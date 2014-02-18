"use strict";

var _ = require('underscore');
var $ = require('jquery');
var async = require('async');
var React = require('react');
var Backbone = require('backbone');
var FastClick = require('fastclick');
var config = require('clientconfig');

// urls/routing
var urls = require('./app/urls');

// models
var User = require('./app/auth/User');

// collections
var UserCollection = require('./app/auth/UserCollection');
var TeamCollection = require('./app/teams/TeamCollection');

// views
var MainView = require('./app/Main');
var SignInView = require('./app/auth/views/SignIn');

require('./app/core/globalEvents');


// Initialize FastClick
FastClick(document.body);


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
  fetchDataCallback: function (err) {
    if (err) {
      console.log('Error fetching data', err);
      if (err === 403) {
        React.renderComponent(SignInView({
          success: _.bind(this.fetchData, this)
        }), document.getElementById('main'));
      }
    } else {
      // we need to access this globally :/
      this.data.requestUser = this.data.users.get(this.data.tokens.url);
      // render MainView with bootstrap data
      React.renderComponent(MainView({
        'teams': this.data.teams,
        'users': this.data.users,
        'requestUser': this.data.requestUser,
        'anonUser': this.data.anonUser
      }), document.getElementById('main'));
    }
  },
  bootstrap: function () {
    // set this to window.app
    window.app = this;
    // fetch app data
    window.app.fetchData();
  }
}, Backbone.Events);


app.bootstrap();
