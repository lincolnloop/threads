'use strict';

var _ = require('underscore');

var utils = {
  // check if user has authenticated
  groupByOrganizations: function (teams) {
    // Group *this* (team collection) by organization
    var data = _.groupBy(teams, function (team) {
      return team.organization;
    });
    // returns the serialized object of organization
    // and it's teams
    return _.map(data, function (teams, org) {
      return {
        name: org,
        teams: teams
      };
    });
  }
};

module.exports = utils;
