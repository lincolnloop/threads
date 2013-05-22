define(['marionette',], function (Marionette) {
    "use strict";

    console.log('gingerApp:create');
    var gingerApp = new Marionette.Application();

    gingerApp.addRegions({
        navRegion: "#nav",
        mainRegion: "#main",
    });


    return gingerApp;
});
