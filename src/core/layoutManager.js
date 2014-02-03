"use strict";

var React = require('react'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');

module.exports = _.extend({
    // TODO: Check if we still need this.
    animations: {
        'contentHome:contentTeam': 'swipeLeft',
        'contentTeam:contentDiscusion': 'swipeLeft',
        'contentDiscussion:contentTeam': 'swipeRight',
        'contentTeam:contentHome': 'swipeRight',
    },
    /*
     * list of content regions. 
     * See renderComponent for additional info.
     */
    regions: {
        'contentMain': document.getElementById('content-main'),
        'navMain': document.getElementById('nav-main'),
        'navTeams': document.getElementById('nav-teams')
    },
    bootstrap: function () {
        console.log('LayoutManager:bootstrap');
        // layout changing events (??)
        this.listenTo(window.app, 'teams:toggle', this.toggleTeamNav);
        return this;
    },
    renderComponent: function (view, target) {
        /*
         * Wrapper around React.RenderComponent.
         * > Handles unmountComponent for situations where we're rendering
         * the same component, but with different data (for example different teams)
         * on contentMain. In these situations, re-rendering the component is not the
         * most effective approach, since the whole data structure will change.
         *
         * Usage:
         * layoutManager.renderComponent(MyReactView({}), '<region-name>');
         *
         */
        console.log('layoutManager:renderComponent', view, target);
        var callback,
            prevMain = this.activeMain;
        // TODO: this logic doesn't seem valid anymore.
        if (target === 'contentMain') {
            this.activeMain = target;
            if (this.activeMain === prevMain) {
                // when rendering the same region
                // unmount existing component and mount new one
                React.unmountComponentAtNode(this.regions[prevMain]);
            }
        }
        // when rendering a component,
        // make sure team nav is hidden
        $('body').removeClass('show-nav');

        // actually render the component through React
        // TODO: animate
        React.renderComponent(view, this.regions[target]);
    },
    toggleTeamNav: function () {
        // Show/Hide the team list nav
        // TODO: Handle animations for the team list
        $('body').toggleClass('show-nav');
    },
    animate: function (prevTarget, newTarget, callback) {
        var animation = this.animations[prevTarget + ':' + newTarget];
        if (animation) {

            callback();
        }
    },
    setupAnimation: function (prevRegion, nextRegion) {
        var $prevRegion = $(prevRegion),
            $nextRegion = $(nextRegion);

        // make sure nextRegion width and height
        // matches prevRegion
        // (not sure this is really needed)
        $nextRegion.width($prevRegion.width());
        $nextRegion.height($prevRegion.height());
    },
    getAnimation: function () {

    },
    swipeLeft: function () {

    },
    swipeRight: function () {

    },
    reset: function () {
    }


}, Backbone.Events);