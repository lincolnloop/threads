(function () {
    "use strict";

    /*
    * requirejs config, paths and shims for common libs
    */
    requirejs.config({
        paths: {
            backbone: '../vendor/backbone/backbone',
            marionette: '../vendor/backbone/backbone.marionette',
            ohrl: '../vendor/ohrl',
            underscore: '../vendor/underscore'
        },
        shim: {
            'underscore': {
                exports: '_'
            },
            'ohrl': {
                exports: 'ohrl'
            },
            'backbone': {
                deps: ['jquery', 'underscore'],
                exports: 'Backbone'
            },
            'marionette' : {
                deps : ['jquery', 'underscore', 'backbone'],
                exports : 'Marionette'
            }
        }
    });

    /*
    * Initialize the main AppRouter
    */
    require(['router'], function(appRouter){
        console.log('main.js:router');
        new appRouter();
    });
})();
