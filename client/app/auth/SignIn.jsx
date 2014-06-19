'use strict';

var Backbone = require('backbone');
var React = require('react');
var log = require('loglevel');
var config = require('../utils/config');
var getCookie = require('../utils/getCookie');
var loadingMixin = require('../mixins/loadingMixin');
var store = require('../store');
var urls = require('../urls');

var SignInView = React.createClass({
  mixins: [loadingMixin],
  loadingClass: 'tanim',

  //
  // Handles the sign-in/token form
  // and stores the token in local storage.
  //
  fetch: function() {
    store.fetch(this.props.success, this.fetchFailed);
  },

  fetchFailed: function(error) {
    // update the csrf token
    store._headers['X-CSRFToken'] = getCookie('csrftoken');
    // redirect to sign in page
    var pathURL = window.location.pathname;
    var signInURL = urls.get('signIn');
    if (pathURL !== signInURL) {
      window.location.href = signInURL;
    } else {
      this.setState({
        'loading': false,
        'displayForm': true,
        'error': error
      });
    }
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
      // remove the csrf token if using the api
      delete store._headers['X-CSRFToken'];
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
      <div className="sign-in content">
      {this.state.displayForm ? <form onSubmit={this.handleSubmit}>
          <label htmlFor="api-key">API Key (<a href={apiLink} target="_blank">obtain key</a>):</label>
          <input type="text" ref="apiKey" id="api-key" className={this.state.error ? "error" : ""} placeholder="Paste your API key here.." />
          {this.state.error ? <div className="error">{this.state.error.message}</div> : ""}
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
