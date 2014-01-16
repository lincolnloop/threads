"use strict";

var React = require('react'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');

module.exports = _.extend({
    bootstrap: function () {
        console.log('LayoutManager');
        // layout regions
        this.mainEl = document.getElementById('content-main');
        this.navMainEl = document.getElementById('nav-main');
        this.teamNavEl = document.getElementById('nav-teams');
        // layout changing events
        this.listenTo(window.app, 'teams:toggle', this.toggleTeamNav);
        return this;
    },
    renderComponent: function (view, target) {
        console.log('layoutManager:renderComponent');
        // make sure team nav is hidden
        $('body').removeClass('show-nav');
        // unmount existing component and mount new one
        React.unmountComponentAtNode(this[target])
        React.renderComponent(view, this[target]);
    },
    toggleTeamNav: function () {
        console.log('TeamListView:toggle');
        // TODO: Handle animations for the team list
        $('body').toggleClass('show-nav');
    }

}, Backbone.Events);