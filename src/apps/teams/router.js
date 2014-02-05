"use strict";

var Backbone = require('backbone'),
  app = require('../../app'),
  TeamDetailView = require('./views/TeamDetail.jsx'),
  layoutManager = require('../../core/layoutManager'),
  NavView = require('../../core/views/nav.jsx');

var TeamRouter = Backbone.Router.extend({
  routes: {
    ":team/": 'detail'
  },
  detail: function (slug) {

    var team = app.data.teams.findWhere({slug: slug});
    // render team detail view
    layoutManager.renderComponent(TeamDetailView({
      team: team
    }), 'contentMain');
    // render top nav
    layoutManager.renderComponent(NavView({
      title: team.get('name'),
      team: team
    }), 'navMain');
  }
});

module.exports = TeamRouter;
