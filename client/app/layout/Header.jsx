'use strict';

var _ = require('underscore');
var app = require('../AppRouter');
var React = require('react');
var log = require('loglevel');
var eventsMixin = require('../mixins/eventsMixin');
var layoutActions = require('../layout/actions');
var urls = require('../urls');

var Header = React.createClass({
  mixins: [eventsMixin],

  ajaxChange: function(options) {
    // {'loading': true/false}
    this.setState(options);
  },

  openNav: function() {
    // trigger action
    layoutActions.openNav();
  },

  handleBack: function() {
    // navigate to back page if one exists
    if (this.props.back && this.props.back !== 'history') {
      return app.history.navigate(this.props.back, {'trigger': true});
    }
    // fallback to history back
    try {
      window.history.back();
    } catch(e) {
      // when everything fails..
      // redirect to /
    }
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
    var backAttrs = {
      'className': 'back',
      'onClick': this.handleBack,
    }
    return (
      <header id="top-nav" className="col-header">
        <span className="nav">
          {this.props.nav ? <a onClick={this.openNav}>NAV</a> : null}
          {this.props.back ? <a className="back" onClick={this.handleBack}>
            <i className="icon icon-back" />
            <span className="back-label">Back</span>
          </a> : null}
        </span>
        <span className="title">{this.state.title}</span>
        {this.state.loading ? <div className="loading-header">
          <div className="loading-header-progress" />
        </div> : null}
        {this.state.contextView}
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
