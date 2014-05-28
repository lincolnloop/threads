'use strict';

var React = require('react');
var log = require('loglevel');

var SearchView = React.createClass({
  handleSubmit: function() {
    alert('search stub');
  },

  render: function() {
    log.info('SearchView:render');
    return (
      <form className="form-view search-view" onSubmit={this.handleSubmit}>
        <div className="form-view-fields">
          <input type="text" value="" className="query" placeholder="Search..." required />
          <select ref="team" className="team">
            <option>Select a team</option>
          </select>
          <label className="titles">
            <input type="checkbox" value="" /> Search titles only
          </label>
          <button type="submit" className="btn btn-search">Search</button>
        </div>
      </form>
    );
  }
});

module.exports = SearchView;
