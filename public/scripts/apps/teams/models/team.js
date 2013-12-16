var Backbone = require('backbone'),
    ohrl = require('ohrl');

var TeamModel = Backbone.Model.extend({
    idAttribute: "url",
    initialize: function () {
        console.log('TeamModel:initialize');
    },
    url: function () {
        return this.id || ohrl.get('api:team');
    }
});

module.exports = TeamModel;
