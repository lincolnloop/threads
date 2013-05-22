define(function (require) {
    "use strict";
    var _ = require('underscore'),
        Backbone = require('backbone'),
        $ = require('jquery'),
        Marionette = require('marionette');

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

    $(document).on("click", "a[href]", function (event) {
        var url = $(event.currentTarget).attr('href');

        Backbone.history.navigate(url, {trigger: true});

        event.preventDefault();
    });

    return gingerApp;
});
