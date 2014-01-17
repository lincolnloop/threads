"use strict";

var React = require('react'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    $ = require('jquery');

module.exports = _.extend({
    animations: {
        'contentHome:contentTeam': 'swipeLeft',
        'contentTeam:contentDiscusion': 'swipeLeft',
        'contentDiscussion:contentTeam': 'swipeRight',
        'contentTeam:contentHome': 'swipeRight',
    },
    regions: {
        'contentMain': 'content-main',
        'navMain': 'nav-main',
        'navTeams': 'nav-teams'
    },
    bootstrap: function () {
        console.log('LayoutManager:bootstrap');
        // layout regions
        _.each(this.regions, function (id, region) {
            this.regions[region] = document.getElementById(id);
            console.log(region, this.regions[region]);
        }, this);
        // layout changing events
        this.listenTo(window.app, 'teams:toggle', this.toggleTeamNav);
        return this;
    },
    renderComponent: function (view, target) {
        console.log('layoutManager:renderComponent', view, target);
        var callback,
            prevTarget = this.activeTarget;
        // make sure team nav is hidden
        $('body').removeClass('show-nav');
        // unmount existing component and mount new one
        this.activeTarget = target;
        callback = _.partial(React.unmountComponentAtNode, this.regions[prevTarget]);
        if (target === prevTarget) {
            callback();
        }
        React.renderComponent(view, this.regions[target]);
        this.animate(prevTarget, target, callback);
    },
    toggleTeamNav: function () {
        console.log('TeamListView:toggle');
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