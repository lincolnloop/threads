'use strict';

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

  historyBack: function() {
    try {
      window.history.back();
    } catch(e) {
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
      'href': this.props.back !== 'history' ? this.props.back : null,
      'onClick': this.props.back === 'history' ? this.historyBack : null,
    }
    return (
      <header id="top-nav">
        <div className="wrapper">
          <span className="action">
            {this.props.back ? React.DOM.a(backAttrs,
              React.DOM.i({'className': "icon icon-back"}),
              React.DOM.span(null, 'Back')
            ) : null}
          </span>
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
    this.setState(nextProps);
  },

  componentWillUnmount: function() {
    this.emitter.off('ajax', this.ajaxChange);
    this.emitter.off('header:update', this.update);
  }
});

module.exports = Header;
