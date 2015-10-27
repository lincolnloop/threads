'use strict';

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var store = require('../store');
var SmallHeader = require('./SmallHeader.jsx');
var SmallFooter = require('./SmallFooter.jsx');

var AppView = React.createClass({

  getInitialState: function() {
    log.info('SmallAppView:getInitialState');
    return {
      'transition': 'right-to-left',
    }
  },

  render: function() {
    log.info('SmallAppView:render', this.state.transition);
    return (
      <section className="app small">
        <SmallHeader title={this.props.title}
                back={this.props.back}
                contextView={this.props.headerContextView} />
        <div className="content-main">
          {this.state.transition !== null ? React.createElement(ReactCSSTransitionGroup, {
              transitionName: this.state.transition,
              transitionEnterTimeout: 2000,
              transitionLeaveTimeout: 2000,
              component: 'div'
            }, this.props.main) : React.createElement('div', null, this.props.main)}
        </div>
        {React.createElement(SmallFooter, {unreadNotifications: this.state.unreadNotifications})}
      </section>
    );
  },

  componentDidUpdate: function() {
    var contentNodes = document.getElementsByClassName('content');
    if (contentNodes.length) {
      // scroll document to top when doing a page transition
      // TODO: Apply this to the new content page only
      window.scrollTo(0,0);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    // manage animation state
    var current = this.props.navLevel ? this.props.navLevel : 0;
    var next = nextProps.navLevel ? nextProps.navLevel : 0;
    var animation = null;

    // determine what next animation should occur
    if (nextProps.animation && nextProps.animation === 'horizontal') {
      animation = next > current ? 'right-to-left' : 'left-to-right';
    }

    if (this.props.animation === 'fadeIn' || nextProps.animation === 'fadeIn') {
      animation = 'fadeIn';
    }

    this.setState({
      'transition': animation
    });
  }
});

module.exports = AppView;
