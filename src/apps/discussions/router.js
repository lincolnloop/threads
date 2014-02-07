"use strict";

var Backbone = require('backbone'),
  React = require('react'),
  layoutManager = require('../../core/layoutManager'),
  Discussion = require('./models/discussion'),
  DiscussionDetailView = require('./views/DiscussionDetail.jsx'),
  DiscussionCreateView = require('./views/DiscussionCreate.jsx'),
  urls = require('../../urls'),
  NavView = require('../../core/views/nav.jsx');

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
    // create
    layoutManager.renderComponent(DiscussionCreateView({
      discussion: new Discussion({team: team.id}),
      team: team
    }), 'contentMain');
    // render top nav
    layoutManager.renderComponent(NavView({
      title: team.get('name'),
      team: team
    }), 'navMain');
  },
  detail: function (teamSlug, discussionId) {
    console.log('DiscussionRouter:detail');
    var team = window.app.data.teams.findWhere({slug: teamSlug}),
      discussionUrl = urls.get('api:discussionChange', {
          discussion_id: discussionId
        }),
      discussion = team.discussions.get(discussionUrl) || new Discussion({url: discussionUrl});
    // main content
    layoutManager.renderComponent(DiscussionDetailView({
      discussion: discussion
    }), 'contentMain');
    // render top nav
    layoutManager.renderComponent(NavView({
      title: team.get('name'),
      team: team
    }), 'navMain');
  }
});

module.exports = DiscussionRouter;
