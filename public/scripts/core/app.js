define(function (require) {
    "use strict";
    var Backbone = require('backbone'),
        $ = require('jquery'),
        Marionette = require('marionette');

    console.log('gingerApp:create');

    var gingerApp = new Marionette.Application();

    gingerApp.addRegions({
        navRegion: "#nav",
        mainRegion: "#main",
    });

    $(document).on("click", "a[href]", function (event) {
        var url = $(event.currentTarget).attr('href');

        Backbone.history.navigate(url, {trigger: true});

        event.preventDefault();
    });

    return gingerApp;
});
