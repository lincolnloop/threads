'use strict';

var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var React = require('react');
var FastClick = require('fastclick');
var log = require('loglevel');
var AppView = require('./app/app');
var router = require('./app/router');
var config = require('./app/utils/config');

var SignInView = require('./app/auth/SignIn.jsx');

// Configure logging
if (config.debug) {
  log.setLevel('debug');
}


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
    Backbone.history.navigate(url, {trigger: true});
    event.preventDefault();
  }
});

$(document).ajaxStart(function () {
  $('body').addClass('loading');
}).ajaxStop(function () {
  $('body').removeClass('loading');
});


// Kick off the app
// ----------------
//React.renderComponent(AppView(), document.getElementById('main'));

React.renderComponent(SignInView({
  'success': function() {
    Backbone.history.start({
      'pushState': true
    });
    React.renderComponent(AppView(), document.getElementById('main'))
  }
}), document.getElementById('main'));
