'use strict';

var React = require('react');

var AppView = React.createClass({

  render: function() {
    return (
      <div className="app">
        {this.props.children}
      </div>
    );
  }
});

module.exports = AppView;
