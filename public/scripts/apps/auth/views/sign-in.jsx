var React = require('react');
var SignInView = {};
/*
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
*/
var SignInView = React.createClass({
    render: function() {
        return (
          <div className="commentBox">
            <h1>Comments</h1>
            <CommentList data={this.state.data} />
            <CommentForm />
          </div>
        );
    }
});
module.exports = SignInView;
