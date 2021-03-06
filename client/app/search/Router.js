'use strict';

var Router = require('ampersand-router');
var React = require('react');
var log = require('loglevel');
var qs = require('query-string');
var dispatcher = require('../dispatcher');
var store = require('../store');
var Search = require('./Search.jsx');
var SearchResults = require('./SearchResults.jsx');

var Router = Router.extend({
  routes: {
    'search/': 'search',
    'search/q/': 'search',
    ':team/search/': 'search'
  },

  search: function() {
    var qo = qs.parse(location.search);
    var team = qo.team ? store.find('teams', {'slug': qo.team}) : null;
    return dispatcher.compact({
        'main': React.createElement(SearchResults, {
          'query': qo.query,
          'team': qo.team,
          'loanimSelector': '.content-main'
        }),
        'team': team
      }).full({
        'list': React.createElement(SearchResults, {
          'query': qo.query,
          'team': qo.team,
          'loanimSelector': '.list-main'
        }),
        'team': team
      }).render();
  }
});

module.exports = Router;
