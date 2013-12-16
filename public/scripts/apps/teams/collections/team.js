var Backbone = require('backbone'),
    TeamModel = require('../models/team');

var TeamCollection = Backbone.Collection.extend({
    model: TeamModel,
    initialize: function () {
        console.log('TeamCollection:initialize');
    },
    url: function () {
        // FIXME
        return 'http://localhost:8000/api/v2/team/'; //ohrl.get('api:team');
    }
});

module.exports = TeamCollection;
