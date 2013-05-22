define(['backbone',
        'jquery'], function (Backbone, $, Todo) {
    "use strict";

    var TodoModel = Backbone.Model.extend({

        initialize: function () {
            console.log('TodoModel:initialize');
        }
    });

    return TodoModel;
});
