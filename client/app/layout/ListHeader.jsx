'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var React = require('react');
var log = require('loglevel');
var eventsMixin = require('../mixins/eventsMixin');
var urls = require('../urls');

var Header = React.createClass({
  mixins: [eventsMixin],

  ajaxChange: function(options) {
    // {'loading': true/false}
    this.setState(options);
  },

  update: function(options) {
    this.setState(options);
  },

  getInitialState: function() {
    return {
      'loading': false,
      'title': '',
      'headerContextView': null
    }
  },

  componentWillMount: function() {
    this.emitter.on('ajax', this.ajaxChange);
    this.emitter.on('header:update', this.update);

    this.setState({
      'title': this.props.title,
      'contextView': this.props.contextView
    })
  },

  render: function () {
    return (
      <header id="top-nav">
        <div className="wrapper">
          <span className="title">{this.state.title}</span>
          {this.state.loading ? <div className="loading-header">
            <div className="loading-header-progress" />
          </div> : null}
          {this.state.contextView}
        </div>
      </header>
    );
  },

  componentWillReceiveProps: function(nextProps) {
    // update state when props change
    // not doing this will cause the AppView updates
    // to override any state set by the emitter.header:update event
    if (!_.isEqual(this.props, nextProps)) {
      this.setState(nextProps);
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (_.isEqual(this.props, nextProps) && _.isEqual(this.state, nextState)) {
      return false;
    }
    return true;
  },

  componentWillUnmount: function() {
    this.emitter.off('ajax', this.ajaxChange);
    this.emitter.off('header:update', this.update);
  }
});

module.exports = Header;
