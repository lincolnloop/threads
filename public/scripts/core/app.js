var _ = require('underscore'),
    $ = require('jquery'),
    async = require('async'),
    Backbone = require('backbone'),
    urls = require('../urls'),
    User = require('../apps/auth/models/user'),
    UserCollection = require('../apps/auth/collections/user'),
    TeamCollection = require('../apps/teams/collections/team');

Backbone.$ = $;

var app = _.extend({
    data: {},
    bootstrap: function () {
        console.log('gingerApp:boostrap');
        var self = this;
        this.data.teams = new TeamCollection();
        this.data.users = new UserCollection();
        this.data.anonUser = new User({
            email: 'nobody@gingerhq.com',
            name: 'Deleted User',
            online: false,
            typing: false
        });
        async.parallel([
            function (cb) {
                // TODO: more is needed here to plug in the tokens
                //       this just fetchs the request users ID
                var url = 'http://localhost:8000' + urls.get('api:refresh_tokens');
                $.ajax({
                    dataType: "json",
                    url: url,
                    headers: {
                        Authorization: 'Token ' + localStorage.Authorization
                    },
                    success: function (data) {
                        self.data.tokens = data;
                        cb(false);
                    }
                });
            },
            function (cb) {
                self.data.teams.fetch({success: function () { cb(false); }});
            },
            function (cb) {
                self.data.users.fetch({success: function () { cb(false); }});
            }
        ], function (err, results) {
            self.data.requestUser = self.data.users.get(self.data.tokens.url);
            self.trigger('ready');
        });
    }
}, Backbone.Events);

Backbone.ajax = function() {
    // adds authorization header to every request
    arguments[0].headers = _.extend(arguments[0].headers || {}, {
        Authorization: 'Token ' + localStorage.Authorization
    });
    return Backbone.$.ajax.apply(Backbone.$, arguments);
};
$('body').removeClass('loading');

$(document).on("click", "a[href]", function (event) {
    var url = $(event.currentTarget).attr('href');

    Backbone.history.navigate(url, {trigger: true});

    event.preventDefault();
});

$(document).ajaxStart(function () {
    $('body').addClass('loading');
}).ajaxStop(function () {
    $('body').removeClass('loading');
});

app.bootstrap();
window.app = app;

module.exports = app;
