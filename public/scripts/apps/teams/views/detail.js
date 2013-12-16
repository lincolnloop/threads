var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
    _ = require('underscore');

var TeamDetailView = Marionette.ItemView.extend({
    initialize: function (options) {
        console.log('TeamView:detail');
    },
    template: function(serializedModel) {
        var html = '<h1><a href="/team/<%= team.slug %>"><%= team.name %></a></h1>',
            data = {
                name: serializedModel.name,
                slug: serializedModel.slug
            };
        return _.template(html, data, {variable: 'team'});
    }
});
module.exports = TeamDetailView;
