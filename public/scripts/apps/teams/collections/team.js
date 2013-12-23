var _ = require('underscore'),
	Backbone = require('backbone'),
    TeamModel = require('../models/team');

var TeamCollection = Backbone.Collection.extend({
    model: TeamModel,

    initialize: function () {
        console.log('TeamCollection:initialize');
    },
    comparator: function (team) {
        return team.get('organization') + team.get('name');
    },
    url: function () {
        // FIXME
        return 'http://localhost:8000/api/v2/team/'; //ohrl.get('api:team');
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
