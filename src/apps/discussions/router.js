"use strict";

var Backbone = require('backbone'),
    React = require('react'),
    layoutManager = require('../../core/layoutManager'),
    Discussion = require('./models/discussion'),
    DiscussionDetailView = require('./views/discussion.jsx'),
    DiscussionCreateView = require('./views/discussionCreate.jsx'),
    urls = require('../../urls');

var DiscussionRouter = Backbone.Router.extend({

    routes: {
        "discussion/create/:teamSlug/": 'create',
        ":teamSlug/:discussionId/:discussionSlug/": 'detail'
    },

    initialize: function () {
        console.log('DiscussionRouter:initialize');
    },

    create: function (teamSlug) {
        console.log('DiscussionRouter:create');
        var team = window.app.data.teams.findWhere({slug: teamSlug});
        layoutManager.renderComponent(DiscussionCreateView({
            discussion: new Discussion({team: team.id}),
            team: team
        }), 'contentMain');
    },

    detail: function (teamSlug, discussionId) {
        console.log('DiscussionRouter:detail');
        var team = window.app.data.teams.findWhere({slug: teamSlug}),
            discussionUrl = urls.get('api:discussionChange', {
                    discussion_id: discussionId
                }),
            discussion = team.discussions.get(discussionUrl) || new Discussion({url: discussionUrl});
        layoutManager.renderComponent(DiscussionDetailView({
            discussion: discussion
        }), 'contentMain');
    }
});

module.exports = DiscussionRouter;