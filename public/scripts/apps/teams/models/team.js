define(['backbone',
        'jquery',
        'ohrl'], function (Backbone, $, ohrl) {
    "use strict";

    var TeamModel = Backbone.Model.extend({
        idAttribute: "url",
        initialize: function () {
            console.log('TeamModel:initialize');
        },
        url: function () {
            return this.id || ohrl.get('api:team');
        }
    });

    return TeamModel;
});
