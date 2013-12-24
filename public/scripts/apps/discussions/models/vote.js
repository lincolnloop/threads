var Backbone = require('backbone');

module.exports = Backbone.Model.extend({

    idAttribute: "url",

    initialize: function (options) {
        if (options.user) {
            this.user = window.app.data.users.get(options.user) || window.app.data.anonUser;
        } else {
            this.user = window.app.data.requestUser;
        }
    },

    url: function () {
        return this.id || this.get('message') + 'vote/';
    }
});