var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone');

Backbone.$ = $;

Backbone.ajax = function(request) {
    // adds authorization header to every request
    request.headers = _.extend(request.headers || {}, {
        Authorization: 'Token ' + localStorage.apiKey
    });
    // convert paths to full URLs
    if (request.url.indexOf('/') === 0) {
        request.url = window.app.config.apiUrl + request.url;
    }
    return Backbone.$.ajax.apply(Backbone.$, arguments);
};

$(document).on("click", "a[href]", function (event) {
    var url = $(event.currentTarget).attr('href');
    if (url.indexOf('http') !== 0) {
        Backbone.history.navigate(url, {trigger: true});
        event.preventDefault();
    }
});

$(document).ajaxStart(function () {
    $('body').addClass('loading');
}).ajaxStop(function () {
    $('body').removeClass('loading');
});