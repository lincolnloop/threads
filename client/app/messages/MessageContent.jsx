'use strict';

var React = require('react');

var MessageContent = React.createClass({
  render: function() {
    return (
      <div className="message-content">
        <div dangerouslySetInnerHTML={{__html: this.props.body}} />
      </div>
    );
  }
});

module.exports = MessageContent;
