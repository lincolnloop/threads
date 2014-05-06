'use strict';

var Backbone = require('backbone');

var AppRouter = Backbone.Router.extend({
  /*
   * Main App Router
   * Handles all route definitions, as a url:key object
   * No routes are handled here directly, but on the AppView instead.
  */
  routes: {
    '': 'index',
    'sign-in/': 'signIn',
    'sign-out/': 'signOut',
    ':team/': 'team:detail',
    'discussion/create/:teamSlug/': 'team:create',
    ':teamSlug/:discussionId/:discussionSlug/': 'discussion:detail',
    ':teamSlug/:discussionId/:discussionSlug/#:messageId': 'discussion:detail',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/edit/': 'message:edit',
    ':teamSlug/:discussionId/:discussionSlug/:messageId/reply/': 'message:reply',
    'discussion:detail:message': 'discussion:detail'
  }
});

module.exports = new AppRouter();
