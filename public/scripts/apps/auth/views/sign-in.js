define(['marionette',], function (Marionette) {
    "use strict";

    var SignInView = Backbone.Marionette.ItemView.extend({
        template: "#my-template",
        initialize: function () {
            console.log('SignInView:initialize');
        },
        render: function () {
            console.log('SignInView:render');
        }

    });

    return SignInView;
});
