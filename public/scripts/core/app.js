var _ = require('underscore'),
    Backbone = require('backbone'),
    Wreqr = require('backbone.wreqr'),
    ChildViewContainer = require('backbone.babysitter'),
    $ = require('jquery'),
    Marionette = require('backbone.marionette');

Marionette.$ = Backbone.$ = $;
Backbone.Wreqr = Wreqr;
Backbone.ChildViewContainer = ChildViewContainer;

Backbone.Marionette.Renderer.render = function(template, data){
  return template(data);
};

console.log('gingerApp:create');

var gingerApp = new Marionette.Application();

gingerApp.addRegions({
    navRegion: "#nav",
    mainRegion: "#main",
});

Backbone.ajax = function() {
    // adds authorization header to every request
    arguments[0].headers = _.extend(arguments[0].headers || {}, {
        Authorization: 'Token ' + localStorage.Authorization
    });
    return Backbone.$.ajax.apply(Backbone.$, arguments);
};
$('body').removeClass('loading');

$(document).on("click", "a[href]", function (event) {
    var url = $(event.currentTarget).attr('href');

    Backbone.history.navigate(url, {trigger: true});

    event.preventDefault();
});

$(document).ajaxStart(function () {
    $('body').addClass('loading');
}).ajaxStop(function () {
    $('body').removeClass('loading');
});

module.exports = gingerApp;
