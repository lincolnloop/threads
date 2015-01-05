'use strict';

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

  fetchFailed: function(error) {
    log.info('fetchFailed');
    // update the csrf token
    store._headers['X-CSRFToken'] = getCookie('csrftoken');
    // redirect to sign in page
    var pathURL = window.location.pathname;
    var signInURL = urls.get('signIn');
    if (pathURL !== signInURL) {
      window.location.href = signInURL + '?next=' + pathURL;
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
      this.setApiKey(apiKey);
    }
    return false;
  },

  setApiKey: function(key) {
    log.debug('setApiKey', key);
    // store the key in local storage
    localStorage.setItem('apiKey', key);
    // update the store headers
    store._headers.Authorization = 'Token ' + key;
    // remove the csrf token if using the api
    delete store._headers['X-CSRFToken'];

    // fetch the initial data
    store.fetch(this.props.success, this.fetchFailed);
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
    var apiKey = localStorage.getItem('apiKey');
    return (
      <div className="sign-in content">
      {this.state.displayForm ? <form onSubmit={this.handleSubmit}>
          <label htmlFor="api-key">API Key (<a href={apiLink} target="_blank">obtain key</a>):</label>
          <input type="text"
                 ref="apiKey"
                 id="api-key"
                 className={this.state.error ? "error" : ""}
                 placeholder="Paste your API key here.."
                 defaultValue={apiKey} />
          {this.state.error ? <div className="error">{this.state.error.message}</div> : ""}
          <input type="submit" />
        </form> : null}
      </div>
    );
  },

  componentDidMount: function() {
    var key = localStorage.getItem('apiKey');
    if (key) {
      return this.setApiKey(key);
    }
    store.fetch(this.props.success, this.fetchFailed);
  }
});

module.exports = SignInView;
