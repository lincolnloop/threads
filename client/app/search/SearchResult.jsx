'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var moment = require('moment');
var React = require('react');
var MessageHeader = require('../messages/MessageHeader.jsx');
var MessageContent = require('../messages/MessageContent.jsx');

var SearchResult = React.createClass({

  handleResultClick: function(evt) {
    var url = evt.currentTarget.dataset.href;
    app.history.navigate(url, {'trigger': true});
  },

  render: function() {
    return (
      <div className="search-result" onClick={this.handleResultClick} data-href={this.props.permalink}>
        <time className="time-ago" dateTime={this.props.date}>{moment(this.props.date).fromNow()}</time>
        <div className="result-header">
          <span className="team">{this.props.team} ></span>
          <a href={this.props.permalink} dangerouslySetInnerHTML={{__html: this.props.title}} />
        </div>
        <ul>
          {_.map(this.props.messages, function(message) {
            return (<li key={message.permalink}>
              <span href={message.permalink}>
                <div className="message-container">
                  <MessageHeader {...message} />
                  <MessageContent body={message.text} />
                </div>
              </span>
            </li>)
          }.bind(this))}
        </ul>
      </div>
    );
  }
});

module.exports = SearchResult;
