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

  getInitialState: function() {
    return {
      'loading': false
    }
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
          <span className="title">{this.props.title}</span>
          {this.state.loading ? <div className="bgAnim">
              <div className="block" />
              <div className="block" />
              <div className="block" />
          </div> : null}
          {this.props.contextView}
        </div>
      </header>
    );
  },

  componentWillMount: function() {
    this.emitter.on('ajax', this.ajaxChange);
  },

  componentWillUnmount: function() {
    this.emitter.off('ajax', this.ajaxChange);
  }
});

module.exports = Header;
