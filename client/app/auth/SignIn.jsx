'use strict';

var Backbone = require('backbone');
var React = require('react');
var log = require('loglevel');
var config = require('../utils/config');
var loadingMixin = require('../mixins/loadingMixin');
var store = require('../store');

var SignInView = React.createClass({
  mixins: [loadingMixin],

  //
  // Handles the sign-in/token form
  // and stores the token in local storage.
  //
  fetch: function() {
    store.fetch(this.props.success, this.fetchFailed);
  },

  fetchFailed: function(error) {
    this.setState({
      'displayForm': true,
      'error': error
    })
  },

  handleSubmit: function (evt) {
    log.info('SignIn:handleSubmit');
    //
    // Store the API key in local storage,
    // and attempt to fetch initial data
    //
    var apiKey = this.refs.apiKey.getDOMNode().value;
    log.debug('SignIn:apiKey', this.refs.apiKey.getDOMNode(), apiKey);
    if (apiKey.length !== 40) {
      this.setState({
        'displayForm': true,
        'error': 'Invalid API Key'
      });
    } else {
      // store the key in local storage
      localStorage.setItem('apiKey', apiKey);
      // update the store headers
      store._headers.Authorization = 'Token ' + apiKey;
      // fetch the initial data
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

  componentWillMount: function() {
    this.setState({'loading': true});
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
