'use strict';

var $ = require('jquery');
var _ = require('underscore');
var moment = require('moment');
var React = require('react');
var log = require('loglevel');
var config = require('../utils/config');
var SearchResult = require('./SearchResult.jsx');

var SearchView = React.createClass({
  handleSubmit: function() {
    var team = !!this.refs.team.getDOMNode().value ? this.refs.team.getDOMNode().text : null;
    if (this.state.loading === true) {
      return false;
    }
    this.setState({'loading': true});
    // https://gingerhq.com/api/v2/searchresult/?q=test&team=&user=&start_date=&end_date=
    $.ajax(config.apiUrl + '/api/v2/searchresult/', {
      'dataType': 'json',
      'data': {
        'q': this.refs.query.getDOMNode().value
      },
      'headers': {
        'Authorization': 'Token ' + localStorage.apiKey
      }
    }).done(function(response) {
      this.setState({
        'loading': false,
        'count': response.count,
        'results': response.results,
        'next': response.next,
        'team': team
      })
    }.bind(this));
    return false;
  },

  getInitialState: function() {
    return {
      'loading': false,
      'count': null,
      'results': null,
      'next': null,
      'team': null
    }
  },

  render: function() {
    return (
      <form className="form-view search-view" onSubmit={this.handleSubmit}>
        <div className="form-view-fields">
          <input type="text" ref="query" className="query" placeholder="Search..." required />
          <select ref="team" className="team">
            <option>Select a team</option>
          </select>
          <label className="titles">
            <input type="checkbox" value="" /> Search titles only
          </label>
          <button type="submit" className="btn btn-search">{this.state.loading ? 'Searching...' : 'Search'}</button>
        </div>
        {this.state.results !== null ? <div className="search-list">
          {_.map(this.state.results, function(result, key) {
            return (<SearchResult key={'result-' + key} team={this.state.team} result={result} />);
          }.bind(this))}
        </div> : this.state.results == 0 ? <div className="search-list empty">
          <h2>No results</h2>
        </div> : null}
      </form>
    );
  }
});

module.exports = SearchView;
