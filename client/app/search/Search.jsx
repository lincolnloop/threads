'use strict';

var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');
var React = require('react');
var ReactDOM = require('react-dom');
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
  handleSubmit: function() {
    var query = ReactDOM.findDOMNode(this.refs.query).value;
    var team = ReactDOM.findDOMNode(this.refs.team).value;
    var page = 1;
    // reset state
    this.setState({
      'loading': true,
      'query': null,
      'count': null,
      'results': null,
      'page': null,
      'next': null,
      'team': null
    });
    // fetch results
    this.fetch(query, team, page).done(function(response) {
      this.setState({
        'loading': false,
        'query': query,
        'count': response.count,
        'results': response.results,
        'next': response.next,
        'team': team,
        'page': response.page
      });
    }.bind(this));
    return false;
  },

  getInitialState: function() {
    return {
      'loading': false,
      'query': null,
      'count': null,
      'results': null,
      'page': null,
      'next': null,
      'team': null
    }
  },

  render: function() {
    var teams = store.findAll('teams');
    return (
      <form className="form-view search-view" onSubmit={this.handleSubmit}>
        <div className="form-view-fields">
          <input type="text" ref="query" className="query" placeholder="Search..." required />
          <select ref="team" className="team">
            <option value="">Select a team...</option>
            {_.map(teams, function(team) {
              return (<option value={team.name}>{team.name}</option>)
            })}
          </select>
          <label className="titles">
            <input type="checkbox" value="" /> Search titles only
          </label>
          <input type="date" className="date-input" placeholder="Start date" />
          <input type="date" className="date-input" placeholder="End date" />
          <button type="submit" className="btn btn-search">{this.state.loading ? 'Searching...' : 'Search'}</button>
        </div>
        {this.state.results !== null ?
          <h4>{this.state.count} results found for "{this.state.query}"</h4>
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
      </form>
    );
  }
});

module.exports = SearchView;
