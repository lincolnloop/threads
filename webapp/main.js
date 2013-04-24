/*
 * requirejs config, paths and shims for common libs
 */
requirejs.config({
    paths: {
        backbone : 'libs/backbone/backbone',
        marionette : 'libs/backbone/backbone.marionette',
        underscore : 'libs/underscore'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
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
