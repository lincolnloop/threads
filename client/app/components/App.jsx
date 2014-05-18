'use strict';

var log = require('loglevel');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');

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
        <CSSTransitionGroup transitionName={this.state.transition}
                          component={React.DOM.div}>
          {this.props.children}
        </CSSTransitionGroup>
      </section>
    );
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
