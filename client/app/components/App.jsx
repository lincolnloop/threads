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
                unreadNotifications={this.state.unreadNotifications} />
        <div className="content">
          <CSSTransitionGroup transitionName={this.state.transition}
                          component={React.DOM.div}>
            {this.props.children}
          </CSSTransitionGroup>
        </div>
        {React.DOM.nav({'id': 'bottom-nav'},
          React.DOM.a({
            'href': '/',
            'children': 'Dashboard'
          })
        )}
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
    var animation;
    if (nextProps.animation && nextProps.animation === 'vertical') {
      animation = next > current ? 'top-to-bottom' : 'bottom-to-top';
    } else {
      animation = next > current ? 'right-to-left' : 'left-to-right';
    }
    this.setState({
      'transition': animation
    });
  }
});

module.exports = AppView;
