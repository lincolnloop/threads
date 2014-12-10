'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var FastClick = require('fastclick');
var log = require('loglevel');
var app = require('./app/AppRouter');
var config = require('./app/utils/config');
var urls = require('./app/urls');

//var FPSCounter = require('./vendor/FPSCounter');
// --------------------
// routers
// --------------------
//var authRoutes = require('./auth/routes');
var TeamRouter = require('./app/teams/Router');
var DiscussionRouter = require('./app/discussions/Router');
var MessageRouter = require('./app/messages/Router');
var NotificationRouter = require('./app/notifications/Router');
var SearchRouter = require('./app/search/Router');
var UserRouter = require('./app/user/Router');

var SignInView = require('./app/auth/SignIn.jsx');

// Configure logging
if (config.debug) {
  log.setLevel('debug');
}

// FPS Counter
//FPSCounter.start();

// Initialize FastClick
// --------------------
FastClick(document.body);


// Initialize global events
// ------------------------
Backbone.$ = $;

Backbone.ajax = function(request) {
  // adds authorization header to every request
  request.headers = _.extend(request.headers || {}, {
    Authorization: 'Token ' + localStorage.apiKey
  });
  // convert paths to full URLs
  if (request.url.indexOf('/') === 0) {
    request.url = config.apiUrl + request.url;
  }
  return Backbone.$.ajax.apply(Backbone.$, arguments);
};

$(document).on('click', 'a[href]', function (event) {
  var url = $(event.currentTarget).attr('href');
  if (url.indexOf('http') !== 0) {
    app.history.navigate(url, {'trigger': true});
    event.preventDefault();
  }
});

$(document).on('click', '.user-mention', function(event) {
  var userId = event.currentTarget.dataset.user;
  app.history.navigate(urls.get('user:detail', userId), {'trigger': true});
});

$(document).ajaxStart(function () {
  $('body').addClass('loading');
}).ajaxStop(function () {
  $('body').removeClass('loading');
});

// Kick off the app
// ----------------
// initialize all routers
new TeamRouter();
new DiscussionRouter();
new MessageRouter();
new NotificationRouter();
new SearchRouter();
new UserRouter();

React.renderComponent(SignInView({
  success: function() {
    log.info('signIn.fetch.done');
    app.history.start({
      'pushState': true
    });
    // check if the current url is the signIn url
    // if it is, navigate to "homepage"
    var pathURL = window.location.pathname;
    var signInURL = urls.get('signIn');
    if (pathURL === signInURL) {
      app.history.navigate(urls.get('dashboard'), {'trigger': true});
    }
  }
}), document.getElementById('main'));
