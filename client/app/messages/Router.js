'use strict';

var Backbone = require('backbone');

// --------------------
// routes
// --------------------
var authRoutes = require('./auth/routes');
var teamRoutes = require('./teams/routes');
var discussionRoutes = require('./discussions/routes');
var messageRoutes = require('./messages/routes');

var AppRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    '': 'index',
    'sign-out/': 'signOut',
    ':team/': 'team:detail',
    'discussion/create/:teamSlug/': 'team:create',
    ':teamSlug/:discussionId/:discussionSlug/': 'discussion:detail',
    ':teamSlug/:discussionId/:discussionSlug/#:messageId': 'discussion:detail',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/edit/': 'message:edit',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/reply/': 'message:reply',
    'discussion:detail:message': 'discussion:detail'
  },

  initialize: function() {
    router.on('route', function(name, args) {
      
      switch: 
      log.info('route >> ', name, args);
    });
  }
    router.on('route:index', this.route(teamRoutes.list));
    //router.on('route:index', this.route(teamRoutes.list));
    router.on('route:signIn', this.route(this.signIn));
    router.on('route:signOut', this.route(authRoutes.signOut));
    router.on('route:team:detail', this.route(teamRoutes.detail));
    router.on('route:team:create', this.route(discussionRoutes.create));
    router.on('route:discussion:detail', this.route(discussionRoutes.detail));
    router.on('route:message:edit', this.route(messageRoutes.edit));
    router.on('route:message:reply', this.route(messageRoutes.reply));
});

module.exports = new AppRouter();
