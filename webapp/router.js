define(['backbone'], function (Backbone) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "": 'home'
        },

        initialize: function () {
            console.log('AppRouter:initialize');

            Backbone.history.start({
                pushState: true
            });
        },

        home: function () {
            console.log('home');
        }
    });

    return AppRouter;

});
