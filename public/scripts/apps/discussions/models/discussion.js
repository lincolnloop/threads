var Backbone = require('backbone'),
    urls = require('../../../urls');

var DiscussionModel = Backbone.Model.extend({
    idAttribute: "url",
    initialize: function () {
        console.log('DiscussionModel:initialize');
    },
    url: function () {
        return this.id || urls.get('api:discussion');
    },
    serialized: function () {
        return this.toJSON();
    }
});

module.exports = DiscussionModel;
