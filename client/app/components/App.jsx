'use strict';

var log = require('loglevel');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var store = require('../store');
var Header = require('../components/Header.jsx');
var Footer = require('../components/Footer.jsx');

var AppView = React.createClass({

  getInitialState: function() {
    log.info('AppView:getInitialState');
    return {
      'transition': 'right-to-left',
      'unreadNotifications': 0
    }
  },

  render: function() {
    log.info('AppView:render', this.state.transition);
    return (
      <section className="app">
        <Header title={this.props.title}
                back={this.props.back}
                contextView={this.props.headerContextView} />
        <div className="content">
          {this.state.transition !== null ? 
            <CSSTransitionGroup transitionName={this.state.transition}
                                component={React.DOM.div}>
            {this.props.children}
            </CSSTransitionGroup> : <div>{this.props.children}</div>
          }
        </div>
        <Footer unreadNotifications={this.state.unreadNotifications} />
      </section>
    );
  },

  componentDidMount: function() {
    store.get('notifications').then(function() {
      var count = store.findAll('notifications', {'is_read': false}).length;
      this.setState({
        'unreadNotifications': count
      })
    }.bind(this));
  },

  componentWillReceiveProps: function(nextProps) {
    // manage animation state
    var current = this.props.navLevel ? this.props.navLevel : 0;
    var next = nextProps.navLevel ? nextProps.navLevel : 0;
    var animation = null;
    if (nextProps.animation && nextProps.animation === 'horizontal') {
      animation = next > current ? 'right-to-left' : 'left-to-right';
    } else if (nextProps.animation === 'vertical') {
      animation = next > current ? 'bottom-to-top' : 'top-to-bottom';
    }
    this.setState({
      'transition': animation
    });
  }
});

module.exports = AppView;
