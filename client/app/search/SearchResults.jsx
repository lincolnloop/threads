'use strict';

var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');
var React = require('react');
var log = require('loglevel');
var config = require('../utils/config');
var eventsMixin = require('../mixins/eventsMixin');
var loadingMixin = require('../mixins/loadingMixin');
var store = require('../store');
var SearchResult = require('./SearchResult.jsx');

var SearchView = React.createClass({
  mixins: [loadingMixin],

  fetch: function(query, teamSlug, page) {
    // https://gingerhq.com/api/v2/searchresult/?q=test&team=&user=&start_date=&end_date=
    return $.ajax(config.apiUrl + '/api/v2/searchresult/', {
      'dataType': 'json',
      'data': {
        'q': query,
        'team': teamSlug,
        'page': page
      },
      'headers': {
        'Authorization': 'Token ' + localStorage.apiKey
      }
    });
  },
  handleLoadMore: function() {
    this.setState({'loading': true});

    this.fetch(this.state.query, this.state.team, this.state.next).done(function(response) {
      // merge results
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
      'query': null,
      'count': null,
      'results': null,
      'page': 1,
      'next': null,
      'team': null
    }
  },

  componentWillMount: function() {
    // view is always loading on the first mount
    this.setState({'loading': true});
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
            return (<SearchResult key={'result-' + key} {...result} />);
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
