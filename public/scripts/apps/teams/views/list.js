var $ = require('jquery'),
    Marionette = require('backbone.marionette'),
    templates = require('templates'),
    TeamCollection = require('../collections/team');

var TeamSingleView = Marionette.ItemView.extend({
    template: templates.teams.listItem,
    initialize: function (options) {
        console.log('TeamView:single');
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
module.exports = TeamListView;
