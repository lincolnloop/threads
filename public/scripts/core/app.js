define(['backbone', 'marionette'], function (Backbone, Marionette) {
    "use strict";

    console.log('gingerApp:create');
    var gingerApp = new Marionette.Application();

    gingerApp.addRegions({
        navRegion: "#nav",
        mainRegion: "#main",
    });

    $(document).on("click", "a[data-pushref]", function (event) {
        var url = $(event.currentTarget).attr('href');

        Backbone.history.navigate(url, {trigger: true});

        event.preventDefault();
    });

    return gingerApp;
});
