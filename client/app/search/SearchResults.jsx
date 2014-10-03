'use strict';

var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');
var React = require('react');
var log = require('loglevel');
var config = require('../utils/config');
var store = require('../store');
var SearchResult = require('./SearchResult.jsx');

var SearchView = React.createClass({
  fetch: function(query, team, page) {
    // https://gingerhq.com/api/v2/searchresult/?q=test&team=&user=&start_date=&end_date=
    return $.ajax(config.apiUrl + '/api/v2/searchresult/', {
      'dataType': 'json',
      'data': {
        'q': query,
        'team': team,
        'page': page
      },
      'headers': {
        'Authorization': 'Token ' + localStorage.apiKey
      }
    });
  },
  handleLoadMore: function() {
    // don't allow a new query if still loading
    if (this.state.loading === true) {
      return false;
    }
    this.setState({'loading': true});

    this.fetch(this.state.query, this.state.team, this.state.next).done(function(response) {
      // merge results
      //var results = 
      this.setState({
        'loading': false,
        'count': response.count,
        'results': _.union(this.state.results, response.results),
        'next': response.next,
        'page': response.page
      });
    }.bind(this));
  },

  getInitialState: function() {
    return {
      'loading': true,
      'query': null,
      'count': null,
      'results': null,
      'page': 1,
      'next': null,
      'team': null
    }
  },

  render: function() {
    var teams = store.findAll('teams');
    return (
      <div className="search-list content-view">
        {this.state.results !== null ?
          <h4>{this.state.count} results found for "{this.props.query}"</h4>
        : null}
        {this.state.results !== null ? <div className="search-list">
          {_.map(this.state.results, function(result, key) {
            return (<SearchResult key={'result-' + key} result={result} />);
          }.bind(this))}
        </div> : this.state.results == 0 ? <div className="search-list empty">
          <h2>No results</h2>
        </div> : null}
        {this.state.next ? 
          <a onClick={this.handleLoadMore} className="load-more">{this.state.loading ? 'Loading...' : 'Load more...'}</a>
        : null}
      </div>
    );
  },

  componentDidMount: function() {
    // fetch results
    this.fetch(this.props.query, this.props.team, this.state.page).done(function(response) {
      this.setState({
        'loading': false,
        'count': response.count,
        'results': response.results,
        'next': response.next,
        'page': response.page
      });
    }.bind(this));
  }
});

module.exports = SearchView;
