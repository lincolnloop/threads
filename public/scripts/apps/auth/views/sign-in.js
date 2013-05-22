define(['marionette',], function (Marionette) {
    "use strict";

    var SignInView = Marionette.ItemView.extend({
        template: _.template("<h1>Sign In</h1>"),
    });

    return SignInView;
});
