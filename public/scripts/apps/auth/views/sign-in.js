define(['backbone', 'marionette',], function (Backbone, Marionette) {
    "use strict";

    var SignInView = Marionette.ItemView.extend({
        template: '#sign-in-template',

        events: {
            'submit #sign-in-form': 'submit'
        },

        addKey: function (apiKey) {
            localStorage.Authorization = apiKey;
        },

        addError: function (message) {
            this.$('.api-key-row').addClass('error')
                .find('input').after('<small>'+message+'</small>');
        },

        submit: function (event) {
            console.log('SignInView:submit');
            var apiKey = $('input[name=api-key]').val();

            this.$('.api-key-row').removeClass('error')
                .find('small').remove();

            if (!apiKey) {
                this.addError('Please add an API Key');
            } else if (apiKey.length !== 40) {
                this.addError('Invalid API Key');
            } else {
                this.addKey(apiKey);
                // TODO: Add a shortcut
                Backbone.history.navigate('/', {trigger: true});
            }
            event.preventDefault();
        }
    });

    return SignInView;
});
