var _ = require('underscore'),
    $ = require('jquery'),
    async = require('async'),
    Backbone = require('backbone'),
    AppRouter = require('./router'),
    config = require('clientconfig'),
    urls = require('./urls'),
    User = require('./apps/auth/models/user'),
    UserCollection = require('./apps/auth/collections/user'),
    TeamCollection = require('./apps/teams/collections/team');

Backbone.$ = $;

var app = _.extend({
    config: config,
    data: {},
    fetchData: function (fetchDataCallback) {
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
                var url = urls.get('api:refresh_tokens');
                $.ajax({
                    dataType: "json",
                    url: app.config.apiUrl + url,
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
            fetchDataCallback();
        });
    },
    start: function () {
        this.router = new AppRouter();
        this.trigger('ready');
    },
    bootstrap: function () {
        console.log('gingerApp:boostrap');
        this.fetchData(_.bind(this.start, this));
    }
}, Backbone.Events);

Backbone.ajax = function(request) {
    // adds authorization header to every request
    request.headers = _.extend(request.headers || {}, {
        Authorization: 'Token ' + localStorage.Authorization
    });
    // convert paths to full URLs
    if (request.url.indexOf('/') === 0) {
        request.url = app.config.apiUrl + request.url;
    }
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

window.app = app;
app.bootstrap();

module.exports = app;
