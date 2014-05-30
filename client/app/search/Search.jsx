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
  handleSubmit: function() {
    var team = this.refs.team.getDOMNode().value;
    if (this.state.loading === true) {
      return false;
    }
    this.setState({
      'loading': true,
      'count': null,
      'results': null,
      'next': null,
      'team': null
    });
    // https://gingerhq.com/api/v2/searchresult/?q=test&team=&user=&start_date=&end_date=
    $.ajax(config.apiUrl + '/api/v2/searchresult/', {
      'dataType': 'json',
      'data': {
        'q': this.refs.query.getDOMNode().value,
        'team': team
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
    var teams = store.findAll('teams');
    return (
      <form className="form-view search-view" onSubmit={this.handleSubmit}>
        <div className="form-view-fields">
          <input type="text" ref="query" className="query" placeholder="Search..." required />
          <select ref="team" className="team">
            <option>Select a team...</option>
            {_.map(teams, function(team) {
              return (<option value={team.name}>{team.name}</option>)
            })}
          </select>
          <label className="titles">
            <input type="checkbox" value="" /> Search titles only
          </label>
          <input type="date" className="date" placeholder="Start date" />
          <input type="date" className="date" placeholder="End date" />
          <button type="submit" className="btn btn-search">{this.state.loading ? 'Searching...' : 'Search'}</button>
        </div>
        {this.state.results !== null ? <div className="search-list">
          {_.map(this.state.results, function(result, key) {
            return (<SearchResult key={'result-' + key} result={result} />);
          }.bind(this))}
        </div> : this.state.results == 0 ? <div className="search-list empty">
          <h2>No results</h2>
        </div> : null}
      </form>
    );
  }
});

module.exports = SearchView;
