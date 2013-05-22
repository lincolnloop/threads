define(['marionette', 'underscore',
        'apps/teams/collections/team'], function (Marionette, _, TeamCollection) {
    var TeamSingleView = Marionette.ItemView.extend({
        initialize: function (options) {
            console.log('TeamView:single');
        },
        template: function(serialized_model) {
            var name = serialized_model.name;
            return _.template('<h1><%= team.name %></h1>', {
                name : name
            }, {variable: 'team'});
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
