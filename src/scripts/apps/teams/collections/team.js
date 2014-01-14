"use strict";

var _ = require('underscore'),
	Backbone = require('backbone'),
    TeamModel = require('../models/team'),
    urls = require('../../../urls');

var TeamCollection = Backbone.Collection.extend({
    model: TeamModel,

    initialize: function () {
        console.log('TeamCollection:initialize');
    },
    comparator: function (team) {
        return team.get('organization') + team.get('name');
    },
    url: function () {
        return urls.get('api:team');
    },
    serialized: function () {
        // Group by organization and serialize each team model
        var data = this.groupBy(function (team) {
            return team.get('organization');
        });
        _.each(data, function (teams, org) {
            data[org] = _.invoke(teams, 'serialized');
        });
        return data;
    }
});

module.exports = TeamCollection;
