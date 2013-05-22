define(['marionette', 'underscore'], function (Marionette, _) {
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
        },
        itemView: TeamSingleView
    });
    return TeamListView;
});
