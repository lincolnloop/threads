'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var FastClick = require('fastclick');
var log = require('loglevel');
var AppRouter = require('./app/AppRouter');
var config = require('./app/utils/config');
var urls = require('./app/urls');
//var FPSCounter = require('./vendor/FPSCounter');

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
    Backbone.history.navigate(url, {'trigger': true});
    event.preventDefault();
  }
});

$(document).on('click', '.user-mention', function(event) {
  var userId = event.currentTarget.dataset.user;
  Backbone.history.navigate(urls.get('user:detail', userId), {'trigger': true});
});

$(document).ajaxStart(function () {
  $('body').addClass('loading');
}).ajaxStop(function () {
  $('body').removeClass('loading');
});


// Kick off the app
// ----------------
new AppRouter();
React.renderComponent(SignInView({
  success: function() {
    log.info('signIn.fetch.done');
    Backbone.history.start({
      'pushState': true
    });
    // check if the current url is the signIn url
    // if it is, navigate to "homepage"
    var pathURL = window.location.pathname;
    var signInURL = urls.get('signIn');
    if (pathURL === signInURL) {
      Backbone.history.navigate(urls.get('dashboard'), {'trigger': true});
    }
  }
}), document.getElementById('main'));
