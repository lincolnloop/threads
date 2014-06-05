'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');
var React = require('react');
var MessageHeader = require('../messages/MessageHeader.jsx');
var MessageContent = require('../messages/MessageContent.jsx');

var SearchResult = React.createClass({

  handleResultClick: function(evt) {
    var url = evt.currentTarget.dataset.href;
    Backbone.history.navigate(url, {'trigger': true});
  },

  render: function() {
    var result = this.props.result;
    return (
      <div className="search-result" onClick={this.handleResultClick} data-href={result.permalink}>
        <time className="time-ago" dateTime={result.date}>{moment(result.date).fromNow()}</time>
        <div className="result-header">
          <span className="team">{result.team} ></span>
          <a href={result.permalink} dangerouslySetInnerHTML={{__html: result.title}} />
        </div>
        <ul>
          {_.map(result.messages, function(message) {
            return (<a href={message.permalink}><div className="message-container">
              <MessageHeader user={message.user} date={message.date} />
              <MessageContent body={message.text} />
            </div></a>)
          }.bind(this))}
        </ul>
      </div>
    );
  }
});

module.exports = SearchResult;
