define(function (require) {
    "use strict";
    var Marionette = require('marionette'), 
        _ = require('underscore'),
        TeamCollection = require('apps/teams/collections/team');

    var TeamSingleView = Marionette.ItemView.extend({
        initialize: function (options) {
            console.log('TeamView:single');
        },
        template: function(serializedModel) {
            var html = '<h1><a href="/team/<%= team.slug %>"><%= team.name %></a></h1>',
                data = {
                    name: serializedModel.name,
                    slug: serializedModel.slug
                }
            return _.template(html, data, {variable: 'team'});
        }
    });

    var TeamListView = Marionette.CollectionView.extend({
        initialize: function (options) {
            console.log('TeamView:list');
            this.collection = new TeamCollection();
            this.collection.fetch();
        },
        itemView: TeamSingleView
    });
    return TeamListView;
});
