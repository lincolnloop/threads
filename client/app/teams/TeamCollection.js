'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var TeamModel = require('./Team');
var urls = require('../urls');
var log = require('loglevel');

var TeamCollection = Backbone.Collection.extend({
  model: TeamModel,

  initialize: function () {
    log.debug('TeamCollection:initialize');
  },
  comparator: function (team) {
    return team.get('organization') + team.get('name');
  },
  url: function () {
    return urls.get('api:team');
  },
  serialized: function () {
    // Group *this* (team collection) by organization
    var data = this.groupBy(function (team) {
      return team.get('organization');
    });
    // returns the serialized object of organization
    // and it's teams
    return _.map(data, function (teams, org) {
      return {
        name: org,
        teams: _.invoke(teams, 'serialized')
      };
    });
  }
});

module.exports = TeamCollection;
