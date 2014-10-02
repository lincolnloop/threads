'use strict';

var _ = require('underscore');
var log = require('loglevel');
var React = require('react');
var CSSTransitionGroup = require('react/lib/ReactCSSTransitionGroup');
var store = require('../store');
var Header = require('./SmallHeader.jsx');
var Footer = require('./SmallFooter.jsx');

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
        <Header title={this.props.title}
                back={this.props.back}
                contextView={this.props.headerContextView} />
        <div className="content-main">
          {this.state.transition !== null ? 
            <CSSTransitionGroup transitionName={this.state.transition}
                                component={React.DOM.div}>
            {this.props.main}
            </CSSTransitionGroup> : <div>{this.props.main}</div>
          }
        </div>
        <Footer unreadNotifications={this.state.unreadNotifications} />
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

window.store = store;

module.exports = AppView;