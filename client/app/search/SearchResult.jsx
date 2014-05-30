'use strict';

var _ = require('underscore');
var moment = require('moment');
var React = require('react');

var SearchResult = React.createClass({

  render: function() {
    var result = this.props.result;
    return (
      <div className="search-result">
        {this.props.team ? null : <span className="team">{result.team} ></span>}
        <a href={result.permalink} dangerouslySetInnerHTML={{__html: result.title}} />
        <time className="timeago" dateTime={result.date}>{moment(result.date).fromNow()}</time>
        <ul>
          {_.map(result.messages, function(message) {
            return (
              <li>{message.text}</li>
            )
          }.bind(this))}
        </ul>
      </div>
    );
  }
});

module.exports = SearchResult;
