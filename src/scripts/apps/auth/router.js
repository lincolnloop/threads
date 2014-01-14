"use strict";

var React = require('react'),
    Backbone = require('backbone'),
    SignInView = require('./views/sign-in.jsx');

var AuthRouter = Backbone.Router.extend({
    routes: {
        "sign-in": 'signIn',
        "sign-out": 'signOut'
    },

    initialize: function () {
        console.log('AuthRouter:initialize');
    },

    signIn: function () {
        console.log('AuthRouter:signIn');
        React.renderComponent(SignInView({}),
                              document.getElementById('main'));
    },

    signOut: function () {
        console.log('AuthRouter:signOut');
    }
});

module.exports = AuthRouter;
