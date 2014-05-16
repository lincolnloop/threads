'use strict';

var Backbone = require('backbone');
var React = require('react');
var config = require('../utils/config');
var store = require('../store');

var SignInView = React.createClass({
  //
  // Handles the sign-in/token form
  // and stores the token in local storage.
  //
  fetch: function() {
    store.fetch(this.fetchSuccess, this.fetchFailed);
  },

  fetchFailed: function(error) {
    this.setState({
      'displayForm': true,
      'error': error
    })
  },

  fetchSuccess: function() {
    // start the backbone router
    Backbone.history.start({
      'pushState': true
    });
  },

  handleSubmit: function (evt) {
    //
    // Store the API key in local storage,
    // and attempt to fetch initial data
    //
    var apiKey = this.refs.apiKey.getDOMNode().value;
    if (apiKey.length !== 40) {
      this.setState({
        'displayForm': true,
        'error': 'Invalid API Key'
      });
    } else {
      // store the key
      localStorage.apiKey = apiKey;
      this.fetch();
    }
    return false;
  },

  getInitialState: function () {
    return {
      'displayForm': false,
      'error': null
    };
  },

  render: function() {
    var apiLink = config.apiUrl + '/accounts/api-access/';
    return (
      <div className="sign-in">
      {this.state.displayForm ? <form onSubmit={this.handleSubmit}>
          <label htmlFor="api-key">API Key (<a href={apiLink} target="_blank">obtain key</a>):</label>
          <input type="text" ref="apiKey" id="api-key" className={this.state.error ? "error" : ""} />
          {this.state.error ? <div className="error">{this.state.error}</div> : ""}
          <input type="submit" />
        </form> : function(){}}
      </div>
    );
  },

  componentDidMount: function() {
    this.fetch();
  }
});

module.exports = SignInView;
