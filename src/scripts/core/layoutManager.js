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
        'contentHome': 'content-home',
        'contentTeam': 'content-team',
        'contentDiscussion': 'content-discussion',
        'navMain': 'nav-main',
        'navTeams': 'nav-teams'
    },
    bootstrap: function () {
        console.log('LayoutManager');
        // layout regions
        _.each(this.regions, function (id, region) {
            this[region] = document.getElementById(id);
        }, this);
        // layout changing events
        this.listenTo(window.app, 'teams:toggle', this.toggleTeamNav);
        return this;
    },
    animate: function (prevTarget, newTarget, callback) {
        var animation = this.animations[prevTarget + ':' + newTarget];
        if (animation) {

            callback();
        }
    },
    renderComponent: function (view, target) {
        console.log('layoutManager:renderComponent');
        var callback,
            prevTarget = this.activeTarget;
        // make sure team nav is hidden
        $('body').removeClass('show-nav');
        // unmount existing component and mount new one
        this.activeTarget = target;
        callback = _.partial(React.unmountComponentAtNode, this[target]);
        if (target === prevTarget) {
            callback();
        }
        React.renderComponent(view, this[target]);
        this.animate(prevTarget, target, callback);
    },
    toggleTeamNav: function () {
        console.log('TeamListView:toggle');
        // TODO: Handle animations for the team list
        $('body').toggleClass('show-nav');
    }

}, Backbone.Events);