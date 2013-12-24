var Backbone = require('backbone'),
    React = require('react'),
    DiscussionDetailView = require('./views/detail.jsx'),
    gingerApp = require('../../core/app'),
    urls = require('../../urls');

var DiscussionRouter = Backbone.Router.extend({

    routes: {
        ":teamSlug/discussions": 'list',
        ":teamSlug/:discussionId/:discussionSlug/": 'detail'
    },

    initialize: function () {
        console.log('DiscussionRouter:initialize');
    },

    list: function () {
        console.log('DiscussionRouter:home');
        $('#content h1').html('List');
    },

    detail: function (teamSlug, discussionId) {
        console.log('DiscussionRouter:detail');
        var team = gingerApp.data.teams.findWhere({slug: teamSlug}),
            discussionUrl = urls.get('api:discussionChange', {
                discussion_id: discussionId
            });
            discussion = team.discussions.get(discussionUrl);
        React.renderComponent(DiscussionDetailView({
            discussion: discussion
        }), document.getElementById('main'));
    }
});

module.exports = DiscussionRouter;
