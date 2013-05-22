define(['backbone',
        'jquery',
        'ohrl',
        'apps/teams/models/team'], function (Backbone,
                                             $,
                                             ohrl,
                                             TeamModel) {
    "use strict";

    var TeamCollection = Backbone.Collection.extend({
        model: TeamModel,
        initialize: function () {
            console.log('TeamCollection:initialize');
        },
        url: function () {
            // FIXME
            return 'https://gingerhq.com/api/v2/team/'; //ohrl.get('api:team');
        }
    });

    return TeamCollection;
});
