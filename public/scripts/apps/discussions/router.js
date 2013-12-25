var Backbone = require('backbone'),
    React = require('react'),
    Discussion = require('./models/discussion'),
    DiscussionDetailView = require('./views/discussion.jsx'),
    urls = require('../../urls');

var DiscussionRouter = Backbone.Router.extend({

    routes: {
        ":teamSlug/:discussionId/:discussionSlug/": 'detail'
    },

    initialize: function () {
        console.log('DiscussionRouter:initialize');
    },

    detail: function (teamSlug, discussionId) {
        console.log('DiscussionRouter:detail');
        var team = window.app.data.teams.findWhere({slug: teamSlug}),
            discussionUrl = urls.get('api:discussionChange', {
                    discussion_id: discussionId
                }),
            discussion = team.discussions.get(discussionUrl) || new Discussion({url: discussionUrl});
        React.renderComponent(DiscussionDetailView({
            discussion: discussion
        }), document.getElementById('main'));
    }
});

module.exports = DiscussionRouter;
