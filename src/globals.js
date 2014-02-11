"use strict";

var _ = require('underscore'),
  Backbone = require('backbone'),
  User = require('./app/auth/models/user'),
  UserCollection = require('./app/auth/collections/user'),
  TeamCollection = require('./app/teams/collections/team');

var globals = _.extend({
  // global data/in-memory cache
  teams: new TeamCollection(),
  users: new UserCollection(),
  anonUser: new User({
    email: 'nobody@gingerhq.com',
    name: 'Deleted User',
    online: false,
    typing: false
  })
}, Backbone.Events);

module.exports = globals;
