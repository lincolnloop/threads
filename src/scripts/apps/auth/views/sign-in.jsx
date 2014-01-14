"use strict";

var React = require('react');

var SignInView = React.createClass({
    getInitialState: function () {
        return {error: null};
    },
    addKey: function (apiKey) {
        localStorage.apiKey = apiKey;
    },
    login: function (event) {
        event.preventDefault();
        var apiKey = document.getElementById('api-key').value;
        if (apiKey.length !== 40) {
            this.setState({error: 'Invalid API Key'});
        } else {
            this.addKey(apiKey);
            window.app.bootstrap();
        }
    },
    render: function() {
        var apiLink = window.app.config.apiUrl + '/accounts/api-access/';
        return (
          <div className="sign-in">
            <form onSubmit={this.login}>
                <label htmlFor="api-key">API Key (<a href={apiLink} target="_blank">obtain key</a>):</label>
                <input type="text" id="api-key" className={this.state.error ? "error" : ""} />
                {this.state.error ? <div className="error">{this.state.error}</div> : ""}
                <input type="submit" />
            </form>
          </div>
        );
    }
});
module.exports = SignInView;
