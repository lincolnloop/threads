var _ = require('underscore'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    TeamCollection = require('../apps/teams/collections/team');

Backbone.$ = $;

var app = _.extend({
    data: {},
    bootstrap: function () {
        console.log('gingerApp:boostrap');
        var self = this;
        this.data.teams = new TeamCollection();
        this.data.teams.fetch({success: function () {
            self.trigger('ready');
        }});
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
