"use strict";

var React = require('react'),
    Backbone = require('backbone'),
    layoutManager = require('../../core/layoutManager'),
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
        layoutManager.renderComponent(SignInView({}), 'contentHome');
    },

    signOut: function () {
        console.log('AuthRouter:signOut');
    }
});

module.exports = AuthRouter;
