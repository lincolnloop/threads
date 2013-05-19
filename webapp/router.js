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
            // homeview
            require(['apps/home/views/home'], function(page){
                console.log('AppRouter.home');
                new page();
            });
        }
    });

    return AppRouter;

});
