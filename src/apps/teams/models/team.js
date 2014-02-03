"use strict";

var Backbone = require('backbone'),
    urls = require('../../../urls'),
    DiscussionCollection = require('../../discussions/collections/discussions');

var TeamModel = Backbone.Model.extend({
    idAttribute: "url",
    initialize: function () {
        console.log('TeamModel:initialize');
        this.discussions = new DiscussionCollection();
        this.discussions.team = this;
    },
    url: function () {
        return this.id || urls.get('api:team');
    },
    link: function () {
        return '/' + urls.get('team:detail', {slug: this.get('slug')});
    },
    serialized: function () {
        var data = this.toJSON();
        data.link = this.link();
        return data;
    }
});

module.exports = TeamModel;