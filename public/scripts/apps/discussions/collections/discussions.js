var _ = require('underscore'),
    Backbone = require('backbone'),
    urls = require('../../../urls'),
    DiscussionModel = require('../models/discussion');

var DiscussionCollection = Backbone.Collection.extend({
    model: DiscussionModel,

    initialize: function () {
        console.log('DiscussionCollection:initialize');
        this.on('sync', function () {
            this.fetched = true;
        }, this);
    },
    url: function () {
        var path;
        if (this.team) {
            path = urls.get('api:discussion:team', {
                team_slug: this.team.get('slug')
            });
        } else {
            path = urls.get('api:discussion');
        }
        // FIXME
        return 'http://localhost:8000' + path;
    },
    comparator: function (discussion) {
        return -discussion.getDateObj().getTime();
    },
    parse: function (response) {
        this.meta = {
            'count': response.count,
            'next': response.next,
            'previous': response.previous
        };
        return response.results;
    },
    serialized: function () {
        var data = this.invoke('serialized');
        return data;
    }
});

module.exports = DiscussionCollection;
