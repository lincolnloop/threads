define(['backbone', 'jquery'], function (Backbone, $) {
    "use strict";

    var DiscussionRouter = Backbone.Router.extend({

        routes: {
            ":team/discussions": 'list',
            ":team/discussions/:discussion:": 'detail'
        },

        initialize: function () {
            console.log('DiscussionRouter:initialize');
        },

        list: function () {
            console.log('DiscussionRouter:home');
            $('#content h1').html('List');
        },

        detail: function () {
            console.log('DiscussionRouter:about');
            $('#content h1').html('Detail');
        }
    });

    return DiscussionRouter;
});