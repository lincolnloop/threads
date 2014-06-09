'use strict';

var log = require('loglevel');
var React = require('react');
var store = require('../store');

var ForkedDiscussionLink = React.createClass({

  getInitialState: function() {
    return {
      'discussion': null,
      'message': null,
    }
  },

  componentWillMount: function() {
    this.setState({'message': store.find('messages', this.props.parent)});
  },

  render: function() {
    return (
      <div className="forked-link">
        {this.state.discussion ? this.state.discussion.title : null}
      </div>
    );
  },

  componentDidMount: function() {
    store.get('messages', {}, {'url': this.props.parent}).done(function() {
      this.setState({
        'message': store.find('messages', this.props.parent)
      });
    }.bind(this));
  }

});

module.exports = ForkedDiscussionLink;
