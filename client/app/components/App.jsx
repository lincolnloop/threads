'use strict';

var log = require('loglevel');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var store = require('../store');
var Header = require('../components/Header.jsx');

var AppView = React.createClass({

  getInitialState: function() {
    log.info('AppView:getInitialState');
    return {
      'transition': 'right-to-left'
    }
  },

  render: function() {
    log.info('AppView:render', this.state.transition);
    return (
      <section className="app">
        <Header title={this.props.title} back={this.props.back} />
        <div className="content">
          <CSSTransitionGroup transitionName={this.state.transition}
                          component={React.DOM.div}>
            {this.props.children}
          </CSSTransitionGroup>
        </div>
      </section>
    );
  },

  componentWillMount: function() {
    store.get('notifications').then(function() {
      log.info('fetched notifications');
    }.bind(this));
  },

  componentWillReceiveProps: function(nextProps) {
    // manage animation state
    var current = this.props.navLevel ? this.props.navLevel : 0;
    var next = nextProps.navLevel ? nextProps.navLevel : 0;
    this.setState({
      'transition': next > current ? 'right-to-left' : 'left-to-right'
    });
  }
});

module.exports = AppView;
