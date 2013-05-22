define(['marionette', 'underscore',
        'apps/teams/collections/team'], function (Marionette, _, TeamCollection) {

    var TeamSingleView = Marionette.ItemView.extend({
        initialize: function (options) {
            console.log('TeamView:single');
        },
        template: function(serializedModel) {
            var html = '<h1><a data-pushref="/team/<%= team.slug %>"><%= team.name %></a></h1>',
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
            this.collection.fetch({
                // FIXME
                headers: { Authorization: 'Token ' + localStorage.Authorization }
            });
        },
        itemView: TeamSingleView
    });
    return TeamListView;
});
