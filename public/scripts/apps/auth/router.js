var Backbone = require('backbone'),
    gingerApp = require('../../core/app'),
    SignInView = require('./views/sign-in');

var AuthRouter = Backbone.Router.extend({
    // $.ajax({url: 'https://gingerhq.com/api/v2/discussion/?team__slug=lincoln-loop&limit=5', headers: {'Authorization': localStorage.Authorization,'content-type': 'application/json'}})
    routes: {
        "sign-in": 'signIn',
        "sign-out": 'signOut'
    },

    initialize: function () {
        console.log('AuthRouter:initialize');
    },

    signIn: function () {
        console.log('AuthRouter:signIn');
        gingerApp.mainRegion.show(new SignInView());
    },

    signOut: function () {
        console.log('AuthRouter:signOut');
    }
});

module.exports = AuthRouter;
