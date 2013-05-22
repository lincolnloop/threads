define(['marionette',], function (Marionette) {
    "use strict";

    var SignInView = Marionette.ItemView.extend({
        template: '#sign-in-template',
    });

    return SignInView;
});
